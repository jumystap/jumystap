<?php

use App\Enums\EducationLevel;
use App\Enums\Roles;

// «Наличие ИП» хранилось строкой: в Inertia-props уезжало "0", а в JS "0" истинно,
// и страница резюме показывала «Да» всем, кто выбрал «Отсутствует».

test('a resume without an individual entrepreneur status exposes a real false', function () {
    $resume = createUserResume(['ip_status' => '0', 'has_car' => '0']);

    $this->get("/resumes/{$resume->id}")
        ->assertOk()
        ->assertInertia(
            fn (\Inertia\Testing\AssertableInertia $page) => $page
                ->component('Resume')
                // Именно false, а не "0": строка в JS истинна и давала «Да».
                ->where('resume.ip_status', false)
                ->where('resume.has_car', false)
        );
});

test('a resume with an individual entrepreneur status exposes true', function () {
    $resume = createUserResume(['ip_status' => '1', 'has_car' => '1']);

    $this->get("/resumes/{$resume->id}")
        ->assertOk()
        ->assertInertia(
            fn (\Inertia\Testing\AssertableInertia $page) => $page
                ->where('resume.ip_status', true)
                ->where('resume.has_car', true)
        );
});

test('an unanswered individual entrepreneur question stays null', function () {
    $resume = createUserResume();

    $this->get("/resumes/{$resume->id}")
        ->assertOk()
        ->assertInertia(
            fn (\Inertia\Testing\AssertableInertia $page) => $page
                ->where('resume.ip_status', null)
                ->where('resume.has_car', null)
        );
});

test('the stored value survives a round trip through the edit form', function () {
    $owner = makeUser(Roles::EMPLOYEE->value);
    $resume = createUserResume(['user' => $owner, 'ip_status' => '0']);

    // Форма шлёт строки '0'/'1', как значения опций Select.
    $this->actingAs($owner)
        ->put("/resumes/{$resume->id}", [
            'email' => 'seeker@example.com',
            'phone' => '77001234567',
            'position' => 'PHP Developer',
            'city' => 'Астана',
            'about' => 'About me text',
            'education_level_id' => EducationLevel::HIGHER->value,
            'organizations' => [],
            'languages' => [],
            'ip_status' => '0',
            'has_car' => '1',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect($resume->fresh()->ip_status)->toBeFalse()
        ->and($resume->fresh()->has_car)->toBeTrue();
});

test('the pdf keeps showing the status correctly', function () {
    $owner = makeUser(Roles::EMPLOYEE->value);
    $resume = createUserResume(['user' => $owner, 'ip_status' => '0']);

    $this->actingAs($owner)
        ->get("/resumes/download/{$resume->id}")
        ->assertOk()
        ->assertHeader('content-type', 'application/pdf');
});
