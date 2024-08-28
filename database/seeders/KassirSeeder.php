<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KassirSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profession = DB::table('professions')->where('name_ru', 'Продавец-кассир')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основные бизнес-процессы кассовых операций в различных сферах (фаст-фуд, ресторан, кафе и др.)",
            "name_kz" => "Әртүрлі салалардағы (фаст-фуд, мейрамхана, кафе және т.б.) кассалық операциялардың негізгі бизнес-процестері."
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основы и принципы работы с кассовым оборудованием (кассовый аппарат, POS - терминал, электронные весы, сканер штрих-кодов, принтер чеков и тд.)",
            "name_kz" => "Кассалық аппаратурамен жұмыс істеу негіздері мен принциптері (кассалық машина, POS терминал, электронды таразы, штрих-код сканері, түбіртек принтері және т.б.)"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Права потребителей (обмен и возврат товаров)",
            "name_kz" => "Тұтынушылардың құқықтары (тауарларды айырбастау және қайтару)"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основы материальной ответственности",
            "name_kz" => "Материалдық жауапкершілік негіздеріне"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Работа в программе IIKO (самая распространенная система учета в сфере общепита)",
            "name_kz" => "lIKO бағдарламасында жұмыс істеу (тамақтану саласының көшбасшысы)"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/cashier1.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/cashier2.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/cashier3.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/cashier4.jpg"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Акмарал',
            'last_name' => 'Асылгазина',
            'middle_name' => 'Мауленовна',
            'description_ru' => 'Преподаватель-практик с опытом работы более 14-ти лет:',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/cashier-teacher.jpg'
        ]);
    }
}
