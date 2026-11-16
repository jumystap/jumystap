<?php

use App\Enums\AnnouncementStatus;
use App\Enums\Roles;
use App\Models\Announcement;
use App\Models\Response;
use Illuminate\Support\Facades\DB;

function adminResponsesVacancy(int $employerId, string $title = 'Бариста'): Announcement
{
    return Announcement::forceCreate([
        'user_id' => $employerId, 'type_kz' => 'type', 'type_ru' => 'тип', 'title' => $title,
        'description' => 'описание', 'payment_type' => 'за месяц', 'specialization_id' => 1,
        'status' => AnnouncementStatus::ACTIVE->value,
    ]);
}

function adminResponsesQueryCount(callable $request): int
{
    DB::flushQueryLog();
    DB::enableQueryLog();
    $request();
    // Запись в visits делает middleware TrackVisits, к странице она не относится.
    $count = collect(DB::getQueryLog())
        ->reject(fn (array $query) => str_contains($query['query'], '`visits`'))
        ->count();
    DB::disableQueryLog();

    return $count;
}

test('admin responses list shows soft-deleted vacancies, seekers and employers with a marker', function () {
    $admin = makeUser(Roles::ADMIN->value);
    $employer = makeUser(Roles::EMPLOYER->value);
    $employee = makeUser(Roles::EMPLOYEE->value);
    $vacancy = adminResponsesVacancy($employer->id, 'Удалённый бариста');
    Response::query()->create(['employee_id' => $employee->id, 'announcement_id' => $vacancy->id]);

    $vacancy->delete();
    $employee->delete();
    $employer->delete();

    $this->actingAs($admin)
        ->get('/admin/responses')
        ->assertOk()
        ->assertSee('Удалённый бариста')
        ->assertSee($employee->name)
        ->assertSee($employer->name)
        ->assertSee('удалена')
        ->assertSee('удалён');
});

test('admin responses list does not run extra queries per row', function () {
    $admin = makeUser(Roles::ADMIN->value);
    $seed = function () {
        $employer = makeUser(Roles::EMPLOYER->value);
        $employee = makeUser(Roles::EMPLOYEE->value);
        Response::query()->create([
            'employee_id' => $employee->id,
            'announcement_id' => adminResponsesVacancy($employer->id)->id,
        ]);
    };

    $seed();
    $this->actingAs($admin);
    $oneRow = adminResponsesQueryCount(fn () => $this->get('/admin/responses')->assertOk());

    foreach (range(1, 5) as $i) {
        $seed();
    }
    $sixRows = adminResponsesQueryCount(fn () => $this->get('/admin/responses')->assertOk());

    expect($sixRows)->toBe($oneRow);
});
