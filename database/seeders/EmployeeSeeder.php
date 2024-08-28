<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employeeRole = DB::table('roles')->where('name', 'employee')->first();
        $professionShveya = DB::table('professions')->where('name_ru', 'Швея 3-го разряда')->first();

        DB::table('users')->insert([
            'name' => 'Алимжанова Дарига',
            'email' => 'employee1@example.com',
            'phone' => '+77057057571',
            'password' => Hash::make('password'),
            'role_id' => $employeeRole->id,
            'profession_id' => $professionShveya->id,
            'status' => 'В активном поиске',
            'work_status' => 'Ищет работу',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        
        $professionWeb = DB::table('professions')->where('name_ru', 'Веб-дизайн и разработка сайтов')->first();

        DB::table('users')->insert([
            'name' => 'Бадыгулова Куралай',
            'email' => 'employee2@example.com',
            'phone' => '+77057057572',
            'password' => Hash::make('password'),
            'role_id' => $employeeRole->id,
            'profession_id' => $professionWeb->id,
            'status' => 'В активном поиске',
            'work_status' => 'Ищет работу',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'name' => 'Ескожиева Алия',
            'email' => 'employee3@example.com',
            'phone' => '+77057057573',
            'password' => Hash::make('password'),
            'role_id' => $employeeRole->id,
            'profession_id' => $professionShveya->id,
            'status' => 'В активном поиске',
            'work_status' => 'Ищет работу',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'name' => 'Камалиева Арайлым',
            'email' => 'employee4@example.com',
            'phone' => '+77057057574',
            'password' => Hash::make('password'),
            'role_id' => $employeeRole->id,
            'profession_id' => $professionShveya->id,
            'status' => 'В активном поиске',
            'work_status' => 'Ищет работу',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'name' => 'Бахтин Иван',
            'email' => 'employee5@example.com',
            'phone' => '+77057057576',
            'password' => Hash::make('password'),
            'role_id' => $employeeRole->id,
            'profession_id' => $professionWeb->id,
            'status' => 'В активном поиске',
            'work_status' => 'Ищет заказы',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        
        $professionTarget = DB::table('professions')->where('name_ru', 'Таргетолог')->first();

        DB::table('users')->insert([
            'name' => 'Шамуратова Жанар',
            'email' => 'employee6@example.com',
            'phone' => '+77057057577',
            'password' => Hash::make('password'),
            'role_id' => $employeeRole->id,
            'profession_id' => $professionTarget->id,
            'status' => 'В активном поиске',
            'work_status' => 'Ищет заказы',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'name' => 'Акдилдаева Балнур',
            'email' => 'employee7@example.com',
            'phone' => '+77057057578',
            'password' => Hash::make('password'),
            'role_id' => $employeeRole->id,
            'profession_id' => $professionTarget->id,
            'status' => 'В активном поиске',
            'work_status' => 'Ищет заказы',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        
        $professionBuhuchet = DB::table('professions')->where('name_ru', 'Основы бухгалтерского учета')->first();

        DB::table('users')->insert([
            'name' => 'Турсынбекова Айгерим',
            'email' => 'employee8@example.com',
            'phone' => '+77057057579',
            'password' => Hash::make('password'),
            'role_id' => $employeeRole->id,
            'profession_id' => $professionBuhuchet->id,
            'status' => 'В активном поиске',
            'work_status' => 'Ищет заказы',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
