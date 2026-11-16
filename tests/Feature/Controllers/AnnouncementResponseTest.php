<?php

use App\Enums\AnnouncementStatus;
use App\Enums\ResumeStatus;
use App\Enums\Roles;
use App\Models\Announcement;
use App\Models\Favorite;
use App\Models\Response;

function makeAnnouncement(int $employerId, array $attributes = []): Announcement
{
    return Announcement::forceCreate(array_merge([
        'user_id' => $employerId,
        'type_kz' => 'type',
        'type_ru' => 'тип',
        'title' => 'Бариста',
        'description' => 'описание вакансии',
        'payment_type' => 'за месяц',
        'specialization_id' => 1,
        'status' => AnnouncementStatus::ACTIVE->value,
        'phone' => '77770001122',
    ], $attributes));
}

test('response prefills whatsapp with vacancy title and active resume link', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id, [
        'title' => 'Бариста',
        'phone' => '+7 (700) 123-45-67',
    ]);
    $resume = createUserResume(['user' => $employee, 'status' => ResumeStatus::ACTIVE]);

    $location = $this->actingAs($employee)
        ->post("/connect/{$announcement->id}")
        ->assertRedirect()
        ->headers->get('Location');

    $decoded = urldecode($location);

    expect($location)->toContain('https://wa.me/77001234567?text=') // телефон очищен от + и скобок
        ->and($decoded)->toContain('Бариста')
        ->and($decoded)->toContain("resumes/{$resume->id}")
        ->and($decoded)->toContain('signature='); // подписанная share-ссылка

    $this->assertDatabaseHas('responses', [
        'announcement_id' => $announcement->id,
        'employee_id' => $employee->id,
    ]);

    // Не залогиненный работодатель по подписанной ссылке видит резюме и контакты.
    preg_match('#/resumes/\d+\?[^\s]*#', $decoded, $m);
    $signedPath = str_replace(config('app.url'), '', $m[0]);

    $this->get($signedPath)->assertInertia(
        fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Resume')
            ->where('resume.phone', $resume->phone)
    );
});

test('response omits resume link when employee has no active resume', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    createUserResume(['user' => $employee, 'status' => ResumeStatus::MODERATION]);
    $announcement = makeAnnouncement($employer->id);

    $location = $this->actingAs($employee)
        ->post("/connect/{$announcement->id}")
        ->assertRedirect()
        ->headers->get('Location');

    expect(urldecode($location))->not->toContain('resumes/');
});

function seedRecentResponses(int $employeeId, int $announcementId, int $count, $createdAt = null): void
{
    Response::insert(array_fill(0, $count, [
        'employee_id' => $employeeId,
        'announcement_id' => $announcementId,
        'created_at' => $createdAt ?? now(),
        'updated_at' => $createdAt ?? now(),
    ]));
}

test('the thirtieth response is allowed and the thirty first is rejected', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);
    $thirtieth = makeAnnouncement($employer->id);
    $thirtyFirst = makeAnnouncement($employer->id);
    seedRecentResponses($employee->id, $announcement->id, 29);

    $this->actingAs($employee)
        ->post("/connect/{$thirtieth->id}")
        ->assertRedirectContains('https://wa.me/');

    $this->assertDatabaseCount('responses', 30);

    $this->post("/connect/{$thirtyFirst->id}")
        ->assertStatus(429)
        ->assertHeaderMissing('Location');

    $this->assertDatabaseCount('responses', 30);
});

test('repeated clicks on the same vacancy within 24 hours neither create a response nor consume the limit', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);

    $this->actingAs($employee);
    $this->post("/connect/{$announcement->id}")->assertRedirectContains('https://wa.me/');
    $this->post("/connect/{$announcement->id}")->assertRedirectContains('https://wa.me/');

    $this->assertDatabaseCount('responses', 1);

    // Даже на исчерпанном лимите чат по уже отправленному отклику открывается.
    seedRecentResponses($employee->id, $announcement->id, 29);

    $this->post("/connect/{$announcement->id}")->assertRedirectContains('https://wa.me/');

    $this->assertDatabaseCount('responses', 30);
});

test('a click on the same vacancy after 24 hours counts as a new response', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);
    seedRecentResponses($employee->id, $announcement->id, 1, now()->subDay()->subMinute());

    $this->actingAs($employee)
        ->post("/connect/{$announcement->id}")
        ->assertRedirectContains('https://wa.me/');

    $this->assertDatabaseCount('responses', 2);
});

test('the limit applies across vacancies and tells when the next response is available', function (string $locale) {
    config(['app.debug' => false]);
    app()->setLocale($locale);
    $this->travelTo(now()->setDate(2026, 11, 16)->setTime(10, 0));
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);
    $otherAnnouncement = makeAnnouncement($employer->id);
    // Самый старый отклик в окне — 14:30 вчера: слот освободится сегодня в 14:30.
    seedRecentResponses($employee->id, $announcement->id, 1, now()->subDay()->setTime(14, 30));
    seedRecentResponses($employee->id, $announcement->id, 29);

    $this->actingAs($employee)
        ->post("/connect/{$otherAnnouncement->id}")
        ->assertStatus(429)
        ->assertHeader('Retry-After', (string) (4 * 3600 + 30 * 60))
        ->assertSee(__('responses.daily_limit', ['limit' => 30, 'time' => '14:30']))
        ->assertHeaderMissing('Location');

    $this->assertDatabaseCount('responses', 30);
})->with(['ru', 'kk', 'en']);

test('the response limit uses a rolling twenty four hour window and releases expired responses', function () {
    $this->travelTo(now()->setDate(2026, 11, 16)->startOfDay()->addMinute());
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);
    $otherAnnouncement = makeAnnouncement($employer->id);
    $createdAt = now()->subMinutes(2);
    seedRecentResponses($employee->id, $announcement->id, 30, $createdAt);

    // Yesterday's responses still count after midnight.
    $this->actingAs($employee)
        ->postJson("/connect/{$otherAnnouncement->id}")
        ->assertStatus(429);

    $this->assertDatabaseCount('responses', 30);
    $this->travelTo($createdAt->copy()->addDay());

    $this->post("/connect/{$otherAnnouncement->id}")
        ->assertRedirectContains('https://wa.me/');

    $this->assertDatabaseCount('responses', 31);
});

test('response limits are independent for each authenticated account', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $otherEmployee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);
    seedRecentResponses($employee->id, $announcement->id, 30);

    $this->actingAs($otherEmployee)
        ->post("/connect/{$announcement->id}")
        ->assertRedirectContains('https://wa.me/');

    $this->assertDatabaseHas('responses', [
        'employee_id' => $otherEmployee->id,
        'announcement_id' => $announcement->id,
    ]);
});

test('the legacy get url redirects to the vacancy page without creating a response', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $otherEmployee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);

    $this->actingAs($employee)
        ->get("/connect/{$otherEmployee->id}/{$announcement->id}")
        ->assertRedirect("/announcement/{$announcement->id}");

    $this->assertDatabaseCount('responses', 0);
});

test('a response cannot be created with a get request', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);

    $this->actingAs($employee)
        ->get("/connect/{$announcement->id}")
        ->assertStatus(405);

    $this->assertDatabaseCount('responses', 0);
});

test('an inertia response request gets an external location to whatsapp', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id, ['phone' => '77770001122']);

    $response = $this->actingAs($employee)
        ->withHeaders(['X-Inertia' => 'true'])
        ->post("/connect/{$announcement->id}")
        ->assertStatus(409);

    $location = $response->headers->get('X-Inertia-Location');

    // Заголовок читается браузером как Latin-1: в нём не должно быть сырой кириллицы.
    expect($location)->toStartWith('https://wa.me/77770001122?text=')
        ->and($location)->toMatch('/^[\x21-\x7E]+$/')
        ->and(urldecode($location))->toContain('Откликаюсь на позицию');
    $this->assertDatabaseCount('responses', 1);
});

test('an inertia request over the limit returns a form error instead of the 429 page', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);
    $otherAnnouncement = makeAnnouncement($employer->id);
    seedRecentResponses($employee->id, $announcement->id, 30);

    $this->actingAs($employee)
        ->from("/announcement/{$otherAnnouncement->id}")
        ->withHeaders(['X-Inertia' => 'true'])
        ->post("/connect/{$otherAnnouncement->id}")
        ->assertRedirect("/announcement/{$otherAnnouncement->id}")
        ->assertSessionHasErrors('connect');

    $this->assertDatabaseCount('responses', 30);
});

test('the legacy url with another employee id neither responds nor bypasses the limit', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $otherEmployee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);
    $otherAnnouncement = makeAnnouncement($employer->id);
    seedRecentResponses($employee->id, $announcement->id, 30);

    $this->actingAs($employee)
        ->followingRedirects()
        ->get("/connect/{$otherEmployee->id}/{$otherAnnouncement->id}")
        ->assertOk()
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page->component('Announcement'));

    $this->assertDatabaseCount('responses', 30);
    $this->assertDatabaseMissing('responses', ['employee_id' => $otherEmployee->id]);
});

test('guests cannot respond to vacancies', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);

    $this->post("/connect/{$announcement->id}")
        ->assertRedirect('/login');

    $this->assertDatabaseCount('responses', 0);
});

test('missing vacancies do not consume the response quota', function () {
    $employee = makeUser(Roles::EMPLOYEE->value);

    $this->actingAs($employee)
        ->post('/connect/999999')
        ->assertNotFound();

    $this->assertDatabaseCount('responses', 0);
});

test('invalid vacancy ids return 404 instead of silently redirecting back', function (string $announcementId) {
    $employee = makeUser(Roles::EMPLOYEE->value);

    $this->actingAs($employee)
        ->post("/connect/{$announcementId}?announcement_id=1")
        ->assertNotFound();

    $this->assertDatabaseCount('responses', 0);
})->with(['invalid', '0', '-1', '1.5']);

test('unpublished vacancies cannot receive responses or disclose contacts', function (AnnouncementStatus $status) {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id, ['status' => $status]);

    $this->actingAs($employee)
        ->post("/connect/{$announcement->id}")
        ->assertNotFound()
        ->assertHeaderMissing('Location');

    $this->assertDatabaseCount('responses', 0);
})->with([
    'moderation' => [AnnouncementStatus::ON_MODERATION],
    'blocked' => [AnnouncementStatus::BLOCKED],
    'archived' => [AnnouncementStatus::ARCHIVED],
]);

test('deleted vacancies cannot receive responses', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);
    $announcement->delete();

    $this->actingAs($employee)
        ->post("/connect/{$announcement->id}")
        ->assertNotFound()
        ->assertHeaderMissing('Location');

    $this->assertDatabaseCount('responses', 0);
});

test('deleting a vacancy preserves responses and does not release the daily quota', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id);
    $otherAnnouncement = makeAnnouncement($employer->id);
    seedRecentResponses($employee->id, $announcement->id, 30);

    $this->actingAs($employer)
        ->delete("/announcements/{$announcement->id}")
        ->assertRedirect('/profile');

    $this->assertSoftDeleted('announcements', ['id' => $announcement->id]);
    $this->assertDatabaseCount('responses', 30);

    $this->actingAs($employee)
        ->post("/connect/{$otherAnnouncement->id}")
        ->assertStatus(429)
        ->assertHeaderMissing('Location');

    $this->assertDatabaseCount('responses', 30);

    $this->get('/my-responses')->assertOk()->assertInertia(
        fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('UserResponses')
            ->has('announcements.data', 0)
    );
});

test('response uses the employer phone when the vacancy has no phone', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id, ['phone' => null]);

    $this->actingAs($employee)
        ->post("/connect/{$announcement->id}")
        ->assertRedirectContains("https://wa.me/{$employer->phone}?text=");

    $this->assertDatabaseHas('responses', [
        'announcement_id' => $announcement->id,
        'employee_id' => $employee->id,
    ]);
});

test('public vacancy page does not expose the vacancy phone', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $announcement = makeAnnouncement($employer->id, ['phone' => '77770001122']);

    $this->get("/announcement/{$announcement->id}")
        ->assertOk()
        ->assertDontSee('77770001122')
        ->assertInertia(
            fn (\Inertia\Testing\AssertableInertia $page) => $page
                ->component('Announcement')
                ->where('announcement.id', $announcement->id)
                ->missing('announcement.phone')
        );
});

test('vacancy edit form still receives the vacancy phone for its owner', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $announcement = makeAnnouncement($employer->id, ['phone' => '77770001122']);

    $this->actingAs($employer)
        ->get("/announcements/update/{$announcement->id}")
        ->assertOk()
        ->assertInertia(
            fn (\Inertia\Testing\AssertableInertia $page) => $page
                ->component('Company/UpdateAnnouncement')
                ->where('announcement.phone', '77770001122')
        );
});

test('guest home feed does not expose vacancy phones', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    makeAnnouncement($employer->id, ['phone' => '77770003344']);
    makeAnnouncement($employer->id, ['phone' => '77770005566', 'is_urgent' => 1]);
    makeAnnouncement($employer->id, ['phone' => '77770007788', 'payment_status' => 'top']);

    $this->get('/')
        ->assertOk()
        ->assertDontSee('77770003344')
        ->assertDontSee('77770005566')
        ->assertDontSee('77770007788');
});

test('favorites page does not expose vacancy phones', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id, ['phone' => '77770003344']);
    Favorite::query()->forceCreate(['user_id' => $employee->id, 'announcement_id' => $announcement->id]);

    $this->actingAs($employee)
        ->get('/fav')
        ->assertOk()
        ->assertDontSee('77770003344')
        ->assertInertia(
            fn (\Inertia\Testing\AssertableInertia $page) => $page
                ->component('Favs')
                ->where('announcements.0.id', $announcement->id)
                ->missing('announcements.0.phone')
        );
});

test('my responses page exposes neither the vacancy phone nor the employer contacts', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id, ['phone' => '77770003344']);
    Response::query()->create(['employee_id' => $employee->id, 'announcement_id' => $announcement->id]);

    $this->actingAs($employee)
        ->get('/my-responses')
        ->assertOk()
        ->assertDontSee('77770003344')
        ->assertDontSee((string) $employer->phone)
        ->assertInertia(
            fn (\Inertia\Testing\AssertableInertia $page) => $page
                ->component('UserResponses')
                ->where('announcements.data.0.id', $announcement->id)
                ->missing('announcements.data.0.phone')
                ->missing('announcements.data.0.user.phone')
                ->missing('announcements.data.0.user.email')
        );
});

test('the contact button is offered only for active vacancies', function (AnnouncementStatus $status, bool $canRespond) {
    $employer = makeUser(Roles::EMPLOYER->value);
    $admin = makeUser(Roles::ADMIN->value);
    $announcement = makeAnnouncement($employer->id, ['status' => $status->value]);

    $this->actingAs($admin)
        ->get("/announcement/{$announcement->id}")
        ->assertOk()
        ->assertInertia(
            fn (\Inertia\Testing\AssertableInertia $page) => $page
                ->component('Announcement')
                ->where('canRespond', $canRespond)
        );
})->with([
    'active' => [AnnouncementStatus::ACTIVE, true],
    'on moderation' => [AnnouncementStatus::ON_MODERATION, false],
    'archived' => [AnnouncementStatus::ARCHIVED, false],
]);
