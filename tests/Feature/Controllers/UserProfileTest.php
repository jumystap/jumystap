<?php

use App\Enums\AnnouncementStatus;
use App\Enums\Roles;
use App\Models\Announcement;
use App\Models\User;

// Публичный профиль соискателя /user/{id} (UserController::show): контакты видит только
// работодатель или компания с активной вакансией, остальным они скрыты.

function profileEmployee(): User
{
    return User::factory()->role(Roles::EMPLOYEE)->create(['email' => 'seeker@example.com']);
}

test('employee profile hides contacts from guests', function () {
    $employee = profileEmployee();

    $this->get("/user/{$employee->id}")
        ->assertOk()
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('User')
            ->where('user.id', $employee->id)
            ->where('contactShow', false)
            ->missing('user.phone')
            ->missing('user.email'))
        ->assertDontSee($employee->phone);
});

test('an employer with an active vacancy sees the employee phone', function () {
    $employee = profileEmployee();
    $employer = User::factory()->role(Roles::EMPLOYER)->create();
    Announcement::forceCreate([
        'user_id' => $employer->id, 'type_kz' => 'type', 'type_ru' => 'тип', 'title' => 'Бариста',
        'description' => 'описание', 'payment_type' => 'за месяц', 'specialization_id' => 1,
        'status' => AnnouncementStatus::ACTIVE->value,
    ]);

    $this->actingAs($employer)
        ->get("/user/{$employee->id}")
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->where('contactShow', true)
            ->where('user.phone', $employee->phone)
            // email не показывается никому.
            ->missing('user.email'));
});

test('an employer without an active vacancy does not see the phone', function () {
    $employee = profileEmployee();
    $employer = User::factory()->role(Roles::EMPLOYER)->create();

    $this->actingAs($employer)
        ->get("/user/{$employee->id}")
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->where('contactShow', false)
            ->missing('user.phone'));
});

test('profiles of non-employees are not shown', function () {
    $employer = User::factory()->role(Roles::EMPLOYER)->create();

    $this->get("/user/{$employer->id}")
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page->component('NotFound'));
});
