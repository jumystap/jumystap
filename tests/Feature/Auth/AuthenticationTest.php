<?php

use App\Models\User;

// Вход в проекте — по телефону и паролю (UserController::auth), а не стоковый Breeze по email.

test('login screen can be rendered', function () {
    $this->get('/login')->assertOk();
});

test('users can authenticate with phone and password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'phone' => $user->phone,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
});

test('after login the user is sent to the local redirect target', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'phone' => $user->phone,
        'password' => 'password',
        'redirect' => '/announcement/5?connect=true',
    ])->assertRedirect('/announcement/5?connect=true');
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'phone' => $user->phone,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('error');

    $this->assertGuest();
});

test('blocked users are logged out right after login', function () {
    $user = User::factory()->create(['is_blocked' => true]);

    $this->post('/login', [
        'phone' => $user->phone,
        'password' => 'password',
    ])->assertSessionHasErrors('error');

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/logout')->assertRedirect('/');

    $this->assertGuest();
});
