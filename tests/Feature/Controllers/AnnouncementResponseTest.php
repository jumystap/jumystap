<?php

use App\Enums\AnnouncementStatus;
use App\Enums\ResumeStatus;
use App\Enums\Roles;
use App\Models\Announcement;

function makeAnnouncement(int $employerId, array $attributes = []): Announcement
{
    return Announcement::forceCreate(array_merge([
        'user_id'           => $employerId,
        'type_kz'           => 'type',
        'type_ru'           => 'тип',
        'title'             => 'Бариста',
        'description'       => 'описание вакансии',
        'payment_type'      => 'за месяц',
        'specialization_id' => 1,
        'status'            => AnnouncementStatus::ACTIVE->value,
        'phone'             => '77770001122',
    ], $attributes));
}

test('response prefills whatsapp with vacancy title and active resume link', function () {
    $employer     = makeUser(Roles::EMPLOYER->value);
    $employee     = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeAnnouncement($employer->id, [
        'title' => 'Бариста',
        'phone' => '+7 (700) 123-45-67',
    ]);
    $resume = createUserResume(['user' => $employee, 'status' => ResumeStatus::ACTIVE]);

    $location = $this->actingAs($employee)
        ->get("/connect/{$employee->id}/{$announcement->id}")
        ->assertRedirect()
        ->headers->get('Location');

    $decoded = urldecode($location);

    expect($location)->toContain('https://wa.me/77001234567?text=') // телефон очищен от + и скобок
        ->and($decoded)->toContain('Бариста')
        ->and($decoded)->toContain("resumes/{$resume->id}")
        ->and($decoded)->toContain('signature='); // подписанная share-ссылка

    $this->assertDatabaseHas('responses', [
        'announcement_id' => $announcement->id,
        'employee_id'     => $employee->id,
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
    $employer     = makeUser(Roles::EMPLOYER->value);
    $employee     = makeUser(Roles::EMPLOYEE->value);
    createUserResume(['user' => $employee, 'status' => ResumeStatus::MODERATION]);
    $announcement = makeAnnouncement($employer->id);

    $location = $this->actingAs($employee)
        ->get("/connect/{$employee->id}/{$announcement->id}")
        ->assertRedirect()
        ->headers->get('Location');

    expect(urldecode($location))->not->toContain('resumes/');
});
