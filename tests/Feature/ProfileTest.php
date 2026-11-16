<?php

use App\Models\User;

// Профиль в проекте только просматривается по GET /profile; редактирование — POST /update
// (UserController::update), удаления аккаунта нет. Стоковые Breeze-тесты PATCH/DELETE /profile
// проверяли несуществующие маршруты и удалены.

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/profile')
        ->assertOk();
});

test('guests are redirected from the profile page to login', function () {
    $this->get('/profile')->assertRedirect('/login');
});
