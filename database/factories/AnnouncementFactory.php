<?php

namespace Database\Factories;

use App\Enums\AnnouncementStatus;
use App\Enums\Roles;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->role(Roles::EMPLOYER),
            'type_kz' => 'Бос орын',
            'type_ru' => 'Вакансия',
            'title' => fake()->jobTitle(),
            'description' => fake()->sentence(),
            'payment_type' => 'Ежемесячная оплата',
            'specialization_id' => 1,
            'status' => AnnouncementStatus::ACTIVE,
        ];
    }

    public function status(AnnouncementStatus $status): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => $status,
        ]);
    }
}
