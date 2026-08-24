<?php

use App\Enums\Roles;
use App\Models\FeedbackApplication;

test('admin can view feedback applications newest first', function () {
    $admin = makeUser(Roles::ADMIN->value);

    FeedbackApplication::query()->create([
        'name' => 'Старая заявка',
        'phone' => '+7 700 000 00 01',
        'skills' => 'Швея',
    ]);
    FeedbackApplication::query()->create([
        'name' => 'Новая заявка',
        'phone' => '+7 700 000 00 02',
        'skills' => 'Бариста, Пекарь',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.feedback-applications.index'))
        ->assertOk()
        ->assertViewIs('admin.feedback-applications.index')
        ->assertSeeInOrder(['Новая заявка', 'Старая заявка'])
        ->assertSeeText('+7 700 000 00 02')
        ->assertSeeText('Бариста, Пекарь');
});

test('moderator can view feedback applications', function () {
    $moderator = makeUser(Roles::MODERATOR->value);

    $this->actingAs($moderator)
        ->get(route('admin.feedback-applications.index'))
        ->assertOk();
});

test('guest and regular user cannot view feedback applications', function () {
    $this->get(route('admin.feedback-applications.index'))
        ->assertRedirect(route('admin.login'));

    $user = makeUser(Roles::EMPLOYEE->value);

    $this->actingAs($user)
        ->get(route('admin.feedback-applications.index'))
        ->assertRedirect(route('admin.login'));
});
