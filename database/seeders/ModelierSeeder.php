<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModelierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profession = DB::table('professions')->where('name_ru', 'Модельер-конструктор')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Базовые навыки построения и моделирования основы плечевых и поясных изделий",
            "name_kz" => "Иық және белдік бұйымдарының негізін құру және модельдеудің негізгі дағдылары"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Построение чертежей сеток и снятию лекал",
            "name_kz" => "Торлардың сызбаларын салу, үлгілерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Моделирование юбок, брюк, платьев, рукавов и плечевых изделий",
            "name_kz" => "Юбка, шалбар, көйлектер, жеңдер мен иық бұйымдарын модельдеу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Снятие мерок",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/fashion1.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/fashion2.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/fashion3.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/fashion4.jpg"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Сәду',
            'last_name' => 'Анар',
            'middle_name' => 'Төлегенқызы',
            'description_ru' => 'Сертифицированный преподаватель-практик с опытом работы более 15-ти лет',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/fashion-teacher.jpg'
        ]);
    }
}
