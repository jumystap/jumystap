<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BaristaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profession = DB::table('professions')->where('name_ru', 'Бариста')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Работать с кофемашинами и оборудованием",
            "name_kz" => "Кофе машиналарымен және жабдықтармен жұмыс істеу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Базовым навыкам приготовления классических кофейных напитков, понимание вкусов, отличие между кофейными напитками",
            "name_kz" => "Классикалық кофе сусындарын дайындаудың негізгі дағдылары, дәмдерді түсіну, кофе сусындарының арасындағы айырмашылық"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Характеристике кофейного сырья",
            "name_kz" => "Кофе шикізатының сипаттамасы"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Технике работы с молоком и латте-арт",
            "name_kz" => "Сүт және латте өнерімен жұмыс істеу техникасы"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основам обслуживания клиентов",
            "name_kz" => "Клиенттерге қызмет көрсету негіздері"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основам кофе и его разновидностям",
            "name_kz" => "Кофенің негізі және оның түрлері"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Технологии приготовления классических рецептур кофе",
            "name_kz" => "Классикалық кофе рецептерін дайындау технологиясы"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/barista1.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/barista2.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/barista3.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/barista4.jpg"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Тұрар',
            'last_name' => 'Ильяс',
            'middle_name' => 'Муратұлы',
            'description_ru' => 'Преподаватель-практик с опытом работы более 14-ти лет:',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/barista-teacher.jpg'
        ]);
    }
}
