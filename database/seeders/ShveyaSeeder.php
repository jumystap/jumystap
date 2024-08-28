<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShveyaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profession = DB::table('professions')->where('name_ru', 'Швея 3-го разряда')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Базовые навыки шитья на прямострочной швейной машинке Jack F5",
            "name_kz" => "JackF5 тік тігісті тігін машинасында тігудің негізгі дағдылары"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Настройка и устранение основных видов неисправностей швейного оборудования",
            "name_kz" => "Тігін жабдықтарындағы ақаулардың негізгі түрлерін реттеу және жою"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Выполнение машинные швы и операции",
            "name_kz" => "Машиналық тігістер мен операцияларды орындау"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Выполнение влажно-тепловые операции по обработке швейных изделий",
            "name_kz" => "Тігін бұйымдарын өңдеу бойынша ылғалды-жылу операцияларын орындау"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Выполнение операции по обработке мелких и крупных деталей (воротники, замки, карманы, пояса)",
            "name_kz" => "Ұсақ және ірі бөлшектерді(жағалар, құлыптар, қалталар, белдіктер) өңдеу бойынша операцияларды орындау"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Пошив рабочего халата либо мужской сорочки",
            "name_kz" => "Жұмыс халатын немесе ерлер көйлегін тігу"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/sewer1.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/sewer2.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/sewer3.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/sewer4.jpg"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Фарида',
            'last_name' => 'Мырзахметова',
            'middle_name' => 'Арыстанбаевна',
            'description_ru' => 'Член Евразийского союза дизайнеров<br/>Сертифицированный преподаватель-практик с опытом работы в швейном деле более 18-ти лет',
            'description_kz' => 'Еуразиялық дизайнерлер одағының мүшесі<br/>Сертификатталған оқытушы-практик, тігін ісінде 18 жылдан астам',
            'image_url' => 'teachers/sewer-teacher.jpg'
        ]);
    }
}
