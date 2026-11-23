<?php

use App\Enums\AnnouncementStatus;
use App\Enums\Roles;
use App\Models\Announcement;
use App\Models\User;

// Уровень образования в вакансии: при создании сохранялся, при редактировании правило
// в AnnouncementUpdateRequest отсутствовало, и новое значение молча выбрасывалось.

function educationUpdatePayload(array $overrides = []): array
{
    // Ровно то, что шлёт Company/UpdateAnnouncement.jsx (удалёнка — без адреса).
    return array_merge([
        'type_kz' => 'Бос орын',
        'type_ru' => 'Вакансия',
        'title' => 'Кассир',
        'description' => 'описание',
        'payment_type' => 'Ежемесячная оплата',
        'salary_type' => 'min',
        'cost_min' => 150000,
        'status' => AnnouncementStatus::ACTIVE->value,
        'city' => 'Дистанционное',
        'location' => [],
        'specialization_id' => 1,
        'responsibility' => [['responsibility' => 'обслуживать кассу']],
        'requirement' => [['requirement' => 'опыт работы']],
        'condition' => [['condition' => 'оформление по ТК']],
        'education' => 'Высшее',
    ], $overrides);
}

test('an employer can change the education level of a vacancy', function () {
    $employer = User::factory()->role(Roles::EMPLOYER)->create();
    $vacancy = Announcement::factory()->create(['user_id' => $employer->id, 'education' => 'Не требуется']);

    $this->actingAs($employer)
        ->put("/announcements/{$vacancy->id}", educationUpdatePayload(['education' => 'Высшее']))
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect($vacancy->fresh()->education)->toBe('Высшее');
});

test('the edit form receives the current education level', function () {
    $employer = User::factory()->role(Roles::EMPLOYER)->create();
    $vacancy = Announcement::factory()->create(['user_id' => $employer->id, 'education' => 'Среднее-специальное']);

    $this->actingAs($employer)
        ->get("/announcements/update/{$vacancy->id}")
        ->assertOk()
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Company/UpdateAnnouncement')
            ->where('announcement.education', 'Среднее-специальное'));
});

test('editing other fields keeps the education level', function () {
    $employer = User::factory()->role(Roles::EMPLOYER)->create();
    $vacancy = Announcement::factory()->create(['user_id' => $employer->id, 'education' => 'Сертификат Joltap']);

    $this->actingAs($employer)
        ->put("/announcements/{$vacancy->id}", educationUpdatePayload(['title' => 'Старший кассир', 'education' => 'Сертификат Joltap']))
        ->assertSessionHasNoErrors();

    expect($vacancy->fresh())
        ->title->toBe('Старший кассир')
        ->education->toBe('Сертификат Joltap');
});

test('a vacancy is created with the chosen education level', function (string $education) {
    $employer = User::factory()->role(Roles::EMPLOYER)->create();

    // Ровно то, что шлёт Company/CreateAnnouncement.jsx (удалёнка — без адреса).
    $this->actingAs($employer)
        ->post('/announcements/store', [
            'type_kz' => 'Бос орын',
            'type_ru' => 'Вакансия',
            'title' => 'Кассир',
            'description' => 'описание',
            'payment_type' => 'Ежемесячная оплата',
            'salary_type' => 'min',
            'cost_min' => 150000,
            'status' => AnnouncementStatus::ACTIVE->value,
            'city' => 'Дистанционное',
            'location' => [],
            'specialization_id' => 1,
            'responsibility' => ['обслуживать кассу'],
            'requirement' => ['опыт работы'],
            'condition' => ['оформление по ТК'],
            'education' => $education,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $vacancy = Announcement::query()->where('user_id', $employer->id)->latest('id')->firstOrFail();
    expect($vacancy->education)->toBe($education);

    // После модерации соискатель видит то же значение на странице вакансии.
    $vacancy->update(['status' => AnnouncementStatus::ACTIVE]);
    $this->get("/announcement/{$vacancy->id}")
        ->assertOk()
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page->where('announcement.education', $education));
})->with(['Не требуется', 'Среднее', 'Среднее-специальное', 'Высшее', 'Сертификат Joltap']);
