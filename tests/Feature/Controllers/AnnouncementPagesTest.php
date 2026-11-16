<?php

use App\Enums\AnnouncementStatus;
use App\Enums\Roles;
use App\Models\Announcement;
use App\Models\User;

// Страницы вакансий (AnnouncementController::index/show/create). Заменяют устаревшие
// Unit-тесты на моках: эти действия читают БД (фильтры, «топ», «срочные», справочники).

function pagesVacancy(int $employerId, array $attributes = []): Announcement
{
    return Announcement::forceCreate(array_merge([
        'user_id' => $employerId, 'type_kz' => 'type', 'type_ru' => 'тип', 'title' => 'Бариста',
        'description' => 'описание', 'payment_type' => 'за месяц', 'specialization_id' => 1,
        'status' => AnnouncementStatus::ACTIVE->value,
    ], $attributes));
}

test('vacancies list shows only active vacancies', function () {
    $employer = User::factory()->role(Roles::EMPLOYER)->create();
    $active = pagesVacancy($employer->id, ['title' => 'Активная вакансия']);
    pagesVacancy($employer->id, ['title' => 'Вакансия на модерации', 'status' => AnnouncementStatus::ON_MODERATION->value]);

    $this->get('/announcements')
        ->assertOk()
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Announcements')
            ->has('announcements.data', 1)
            ->where('announcements.data.0.id', $active->id));
});

test('a non-active vacancy page redirects guests to the list', function () {
    $employer = User::factory()->role(Roles::EMPLOYER)->create();
    $vacancy = pagesVacancy($employer->id, ['status' => AnnouncementStatus::ON_MODERATION->value]);

    $this->get("/announcement/{$vacancy->id}")->assertRedirect('/announcements');
});

test('an admin can open a non-active vacancy page', function () {
    $employer = User::factory()->role(Roles::EMPLOYER)->create();
    $admin = User::factory()->role(Roles::ADMIN)->create();
    $vacancy = pagesVacancy($employer->id, ['status' => AnnouncementStatus::ARCHIVED->value]);

    $this->actingAs($admin)
        ->get("/announcement/{$vacancy->id}")
        ->assertOk()
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Announcement')
            ->where('announcement.id', $vacancy->id));
});

test('a missing vacancy redirects back with an error', function () {
    $this->from('/announcements')
        ->get('/announcement/999999')
        ->assertRedirect('/announcements')
        ->assertSessionHasErrors('error');
});

test('employers can open the vacancy creation form', function () {
    $employer = User::factory()->role(Roles::EMPLOYER)->create();

    $this->actingAs($employer)
        ->get('/announcements/create')
        ->assertOk()
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page->component('Company/CreateAnnouncement'));
});

test('job seekers cannot open the vacancy creation form', function () {
    $employee = User::factory()->role(Roles::EMPLOYEE)->create();

    $this->actingAs($employee)
        ->get('/announcements/create')
        ->assertRedirect('/');
});
