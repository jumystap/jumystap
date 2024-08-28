<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnnouncementsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employer = DB::table('users')->where('email', '1@gmail.com')->first();
        DB::table('announcements')->insert([
            "type_ru" => "Вакансия",
            "type_kz" => "Вакансия",
            "title" => "Компания Ютария ищет оператора швейного производства", 
            "description" => '- Система наставничества - Бесплатное питание (обеды) - Имеется развозка График работы: 09:00 - 18:00, пять дней в неделю" Сдельная оплата труда',
            "active" => true,
            "payment_type" => "зарплата",
            "cost" => 100000,
            'user_id' => $employer->id
        ]);
    }
}
