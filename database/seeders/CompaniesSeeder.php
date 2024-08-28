<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CompaniesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roleCompany = DB::table('roles')->where('name', 'company')->first();
        $roleEmployer = DB::table('roles')->where('name', 'employer')->first();

        DB::table('users')->insert([
            'name' => 'ТОО "ПИК ЮТАРИЯ LTD"',
            'role_id' => $roleEmployer->id,
            'password' => Hash::make('password'),
            'phone' => '+77019999711',
            'email' => '1@gmail.com',
            'description' => 'Лидер на рынке Казахстана с 2002 года в производстве одежды, домашнего текстиля, средств защиты для промышленного сектора и военного обмундирования с использованием передовых технологий',
        ]); 
    }
}
