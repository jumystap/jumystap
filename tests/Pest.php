<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "uses()" function to bind a different classes or traits.
|
*/

uses(TestCase::class, RefreshDatabase::class)->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}

function makeUser(int $roleId): \App\Models\User
{
    // The custom users table requires a role_id that references roles.id,
    // so make sure the role exists before creating the user. The default
    // UserFactory targets the stock Laravel schema (email_verified_at) which
    // this project does not use, so build the user directly instead.
    \Illuminate\Support\Facades\DB::table('roles')->updateOrInsert(
        ['id' => $roleId],
        ['name' => 'role_' . $roleId, 'name_kz' => 'role_' . $roleId, 'name_ru' => 'role_' . $roleId]
    );

    static $seq = 0;
    $seq++;

    return \App\Models\User::forceCreate([
        'name'     => 'Test User ' . $seq,
        'email'    => 'user' . $seq . '_' . uniqid() . '@example.com',
        'phone'    => (string) (77000000000 + $seq),
        'password' => \Illuminate\Support\Facades\Hash::make('password'),
        'role_id'  => $roleId,
    ]);
}

function createUserResume(array $attributes = []): \App\Models\UserResume
{
    $user = $attributes['user'] ?? makeUser(\App\Enums\Roles::EMPLOYEE->value);
    unset($attributes['user']);

    return \App\Models\UserResume::create(array_merge([
        'user_id'  => $user->id,
        'position' => 'PHP Developer',
        'phone'    => '77001234567',
        'city'     => 'Астана',
        'about'    => 'About me text',
        'skills'   => [],
        'status'   => \App\Enums\ResumeStatus::ACTIVE,
    ], $attributes));
}
