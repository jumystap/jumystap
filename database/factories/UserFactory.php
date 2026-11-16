<?php

namespace Database\Factories;

use App\Enums\Roles;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Схема users в проекте своя, не стоковая Laravel: подтверждается телефон
 * (phone_verified_at, phone уникален и обязателен), а role_id — обязательный
 * внешний ключ на roles, поэтому роль создаётся при необходимости.
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => '7'.fake()->unique()->numerify('70#######'),
            'phone_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role_id' => fn () => static::ensureRole(Roles::EMPLOYEE),
        ];
    }

    /**
     * Indicate that the model's phone number should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'phone_verified_at' => null,
        ]);
    }

    public function role(Roles $role): static
    {
        return $this->state(fn (array $attributes) => [
            'role_id' => static::ensureRole($role),
        ]);
    }

    private static function ensureRole(Roles $role): int
    {
        $name = strtolower($role->name);

        DB::table('roles')->updateOrInsert(
            ['id' => $role->value],
            ['name' => $name, 'name_kz' => $name, 'name_ru' => $name]
        );

        return $role->value;
    }
}
