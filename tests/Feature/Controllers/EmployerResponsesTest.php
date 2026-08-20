<?php

use App\Enums\AnnouncementStatus;
use App\Enums\ResumeStatus;
use App\Enums\Roles;
use App\Models\Announcement;
use App\Models\AnnouncementVisit;
use App\Models\Response;
use App\Models\Visit;
use Illuminate\Support\Facades\Exceptions;
use Inertia\Testing\AssertableInertia;

function makeEmployerAnnouncement(int $employerId, array $attributes = []): Announcement
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

test('employer responses page lists responses to own vacancies with a resume link', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeEmployerAnnouncement($employer->id, ['title' => 'Бариста']);
    $resume = createUserResume(['user' => $employee, 'status' => ResumeStatus::ACTIVE]);
    Response::create(['announcement_id' => $announcement->id, 'employee_id' => $employee->id]);

    $this->actingAs($employer)
        ->get('/employer/responses')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Company/EmployerResponses')
            ->has('responses.data', 1)
            ->where('responses.data.0.announcement.title', 'Бариста')
            ->where('responses.data.0.user.name', $employee->name)
            ->where('responses.data.0.resume_id', $resume->id)
        );
});

test('employer responses page excludes responses to other employers vacancies', function () {
    $employerA = makeUser(Roles::EMPLOYER->value);
    $employerB = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcementB = makeEmployerAnnouncement($employerB->id);
    Response::create(['announcement_id' => $announcementB->id, 'employee_id' => $employee->id]);

    $this->actingAs($employerA)
        ->get('/employer/responses')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Company/EmployerResponses')
            ->has('responses.data', 0)
        );
});

test('employer responses page returns null resume when responder has no active resume', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeEmployerAnnouncement($employer->id);
    createUserResume(['user' => $employee, 'status' => ResumeStatus::MODERATION]);
    Response::create(['announcement_id' => $announcement->id, 'employee_id' => $employee->id]);

    $this->actingAs($employer)
        ->get('/employer/responses')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Company/EmployerResponses')
            ->has('responses.data', 1)
            ->where('responses.data.0.resume_id', null)
        );
});

test('simplified announcement page exposes responders with resume ids and drops heavy stats', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $announcement = makeEmployerAnnouncement($employer->id);
    $resume = createUserResume(['user' => $employee, 'status' => ResumeStatus::ACTIVE]);
    Response::create(['announcement_id' => $announcement->id, 'employee_id' => $employee->id]);

    $this->actingAs($employer)
        ->get("/profile/announcement/{$announcement->id}")
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Company/CompanyAnnouncement')
            ->where('totalResponses', 1)
            ->has('respondedUsers', 1)
            ->where('respondedUsers.0.resume_id', $resume->id)
            ->has('respondedUsers.0.responded_at')  // время отклика присутствует
            ->has('uniqueVisitors')                 // лёгкие счётчики (из announcement_visits)
            ->has('repeatedVisitors')
            ->has('responseRate')
            ->missing('viewsOverTime')              // тяжёлые графики по времени убраны
            ->missing('peakViewingTimes')
        );
});

test('announcement page computes unique and repeated visitors from announcement_visits', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $announcement = makeEmployerAnnouncement($employer->id);
    $now = now()->toDateTimeString();

    $row = fn ($userId, $ip) => [
        'announcement_id' => $announcement->id,
        'user_id' => $userId,
        'ip_address' => $ip,
        'device_type' => 'desktop',
        'source_visit_id' => null,
        'created_at' => $now,
    ];

    // u:10 ×3 (повторный), u:11 ×1, ip:5.5.5.5 ×2 (повторный, гость), ip:6.6.6.6 ×1 (гость)
    AnnouncementVisit::insert([
        $row(10, '1.1.1.1'), $row(10, '1.1.1.1'), $row(10, '1.1.1.1'),
        $row(11, '2.2.2.2'),
        $row(null, '5.5.5.5'), $row(null, '5.5.5.5'),
        $row(null, '6.6.6.6'),
    ]);

    $this->actingAs($employer)
        ->get("/profile/announcement/{$announcement->id}")
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Company/CompanyAnnouncement')
            ->where('totalViews', 7)
            ->where('uniqueVisitors', 4)     // u:10, u:11, ip:5.5.5.5, ip:6.6.6.6
            ->where('repeatedVisitors', 2)   // u:10 (×3) и ip:5.5.5.5 (×2)
        );
});

test('backfill copies announcement page visits, excludes self-views and is idempotent', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $announcement = makeEmployerAnnouncement($employer->id);
    $base = 'https://jumystap.kz';

    // Валидные просмотры вакансии (в т.ч. с query-строкой).
    Visit::create(['user_id' => null, 'url' => "{$base}/announcement/{$announcement->id}", 'ip_address' => '1.1.1.1', 'device_type' => 'desktop']);
    Visit::create(['user_id' => $employer->id, 'url' => "{$base}/announcement/{$announcement->id}?utm=x", 'ip_address' => '1.1.1.2', 'device_type' => 'mobile']);
    // Должны быть исключены/пропущены:
    Visit::create(['user_id' => $employer->id, 'url' => "{$base}/profile/announcement/{$announcement->id}", 'ip_address' => '1.1.1.3', 'device_type' => 'desktop']); // self-view работодателя
    Visit::create(['user_id' => null, 'url' => "{$base}/announcements", 'ip_address' => '1.1.1.4', 'device_type' => 'desktop']); // список вакансий
    Visit::create(['user_id' => null, 'url' => "{$base}/announcement/999999", 'ip_address' => '1.1.1.5', 'device_type' => 'desktop']); // несуществующая вакансия → FK skip

    $this->artisan('app:announcement-visits:backfill')->assertExitCode(0);

    expect(AnnouncementVisit::count())->toBe(2)
        ->and(AnnouncementVisit::where('announcement_id', $announcement->id)->count())->toBe(2);

    // Повторный запуск не плодит дубли (unique source_visit_id).
    $this->artisan('app:announcement-visits:backfill')->assertExitCode(0);
    expect(AnnouncementVisit::count())->toBe(2);
});

test('visiting an announcement page records an announcement visit', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $announcement = makeEmployerAnnouncement($employer->id);

    $this->get("/announcement/{$announcement->id}");

    expect(AnnouncementVisit::where('announcement_id', $announcement->id)->count())->toBe(1);
});

test('visiting a non-existent announcement is silently ignored (no reported exception)', function () {
    Exceptions::fake();

    $this->get('/announcement/999999'); // show() редиректит; middleware не должен ни упасть, ни залогировать

    expect(AnnouncementVisit::count())->toBe(0);
    Exceptions::assertNothingReported();
});
