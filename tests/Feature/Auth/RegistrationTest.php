<?php

use App\Enums\Roles;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

// Регистрация в проекте — по телефону с ролью (UserController::store); после создания
// пользователя UserService ищет его сертификаты в Bitrix — в тестах внешний вызов подменён.

beforeEach(function () {
    Http::fake();
    // Роль ищется по имени (UserService::storeUser).
    DB::table('roles')->updateOrInsert(
        ['id' => Roles::EMPLOYEE->value],
        ['name' => 'employee', 'name_kz' => 'employee', 'name_ru' => 'employee']
    );
});

test('registration screen can be rendered', function () {
    $this->get('/register')->assertOk();
});

test('new users can register with a phone and a role', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'phone' => '77071234567',
        'email' => 'test@example.com',
        'password' => 'password',
        'role' => 'employee',
    ])->assertRedirect('/profile');

    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', [
        'phone' => '77071234567',
        'role_id' => Roles::EMPLOYEE->value,
    ]);
});

test('a phone can be registered only once', function () {
    $existing = User::factory()->create();

    $this->post('/register', [
        'name' => 'Test User',
        'phone' => $existing->phone,
        'email' => 'other@example.com',
        'password' => 'password',
        'role' => 'employee',
    ])->assertSessionHasErrors('phone');

    $this->assertGuest();
});

test('after registration an off-site redirect target is ignored', function (string $target) {
    $this->post('/register', [
        'name' => 'Test User',
        'phone' => '77071234567',
        'email' => 'test@example.com',
        'password' => 'password',
        'role' => 'employee',
        'redirect' => $target,
    ])->assertRedirect('/profile');

    $this->assertAuthenticated();
})->with([
    'protocol-relative' => '//evil.com',
    'backslash' => '/\\evil.com',
    'tab stripped by browser' => "/\t/evil.com",
    'absolute url' => 'https://evil.com',
]);

test('after registration the user is sent to the local redirect target', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'phone' => '77071234567',
        'email' => 'test@example.com',
        'password' => 'password',
        'role' => 'employee',
        'redirect' => '/ad/7?connect=true',
    ])->assertRedirect('/ad/7?connect=true');
});
