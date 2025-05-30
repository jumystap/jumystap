<?php

namespace Database\Seeders;

use App\Enums\Roles;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'id' => Roles::EMPLOYER->value,
                'name' => 'employer',
                'name_kz' => 'Жұмыс беруші',
                'name_ru' => 'Работодатель',
            ],
            [
                'id' => Roles::EMPLOYEE->value,
                'name' => 'employee',
                'name_kz' => 'Түлек',
                'name_ru' => 'Выпускник',
            ],
            [
                'id' => Roles::COMPANY->value,
                'name' => 'company',
                'name_kz' => 'Тапсырыс беруші',
                'name_ru' => 'Заказчик',
            ],
            [
                'id' => Roles::ADMIN->value,
                'name' => 'admin',
                'name_kz' => 'Администратор',
                'name_ru' => 'Администратор',
            ],
            [
                'id' => Roles::MODERATOR->value,
                'name' => 'moderator',
                'name_kz' => 'Модератор',
                'name_ru' => 'Модератор',
            ],
            [
                'id' => Roles::NON_GRADUATE->value,
                'name' => 'non_graduate',
                'name_kz' => 'Түлек емес',
                'name_ru' => 'Не выпускник',
            ]
        ];

        foreach ($roles as $role) {
            $item = Role::query()->find($role['id']);

            if (!$item) {
                Role::query()->create($role);
            }
        }
    }

}
