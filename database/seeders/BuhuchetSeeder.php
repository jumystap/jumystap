<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BuhuchetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profession = DB::table('professions')->where('name_ru', 'Основы бухгалтерского учета')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основы предпринимательской деятельности и бухгалтерского учета",
            "name_kz" => "Иық және белдік бұйымдарының негізін құру және модельдеудің негізгі дағдылары"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Осуществление кассовых и банковских операций",
            "name_kz" => "Торлардың сызбаларын салу, үлгілерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Расчет заработной платы",
            "name_kz" => "Методы очистки обуви от загрязнений"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Использование программы 1С для бухгалтерского учета",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Учет основных средств и товарно-материальных запасов",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Электронные счета-фактуры и товарно-транспортные накладные",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Понимание режимов налогообложения, включая НДС",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Составление налоговых отчетов",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/accountant1.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/accountant2.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/accountant3.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/accountant4.jpg"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Жунусова',
            'last_name' => 'Сара',
            'middle_name' => ' Аубакировна',
            'description_ru' => 'Директор ОИПиЮЛ «НПО Ассоциация налогоплательщиков и бухгалтеров»',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/accountant-teacher.jpg'
        ]);
    }
}
