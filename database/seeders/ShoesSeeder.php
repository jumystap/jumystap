<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShoesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profession = DB::table('professions')->where('name_ru', 'Ремонт обуви и изготовление ключей')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основные и комплексные техники ремонта обуви",
            "name_kz" => "Иық және белдік бұйымдарының негізін құру және модельдеудің негізгі дағдылары"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Знание различных материалов и инструментов, необходимых для работы",
            "name_kz" => "Торлардың сызбаларын салу, үлгілерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Применение мер предосторожности при работе в мастерской",
            "name_kz" => "Методы очистки обуви от загрязнений"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Анализ конструкции обуви и её разборку",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Техники набойки, замены подошв и каблуков",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Изготовление ключей как машинным, так и ручным способом",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/keys1.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/keys2.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/keys3.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/keys4.jpg"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Нурбаев',
            'last_name' => 'Алмас',
            'middle_name' => ' Еслямбекович',
            'description_ru' => 'Сертифицированный преподаватель-практик с опытом работы более 15-ти лет',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/keys-teacher.jpg'
        ]);
    }
}
