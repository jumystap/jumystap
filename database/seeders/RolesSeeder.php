<?php

namespace Database\Seeders;

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
        $roles = ['employer', 'employee', 'company', 'admin'];

        DB::table('roles')->insert([
            'name' => 'employer',
            'name_kz' => 'Жұмыс беруші',
            'name_ru' => 'Работодатель',
        ]);

        DB::table('roles')->insert([
            'name' => 'employee',
            'name_kz' => 'Түлек',
            'name_ru' => 'Выпускник',
        ]);

        DB::table('roles')->insert([
            'name' => 'company',
            'name_kz' => 'Тапсырыс беруші',
            'name_ru' => 'Заказчик',
        ]);

        DB::table('roles')->insert([
            'name' => 'admin',
            'name_kz' => 'Администратор',
            'name_ru' => 'Администратор',
        ]);
    }
}
