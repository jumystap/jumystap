<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MebelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profession = DB::table('professions')->where('name_ru', 'Основы изготовления корпусной мебели')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Работа с различными материалами, инструментами и оборудованием",
            "name_kz" => "Әр түрлі материалдармен, құралдармен және жабдықтармен жұмыс"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Выполнение точных замеров",
            "name_kz" => "Дәл өлшеу жүргізу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Разработка дизайн-проектов и проектирование корпусной мебели",
            "name_kz" => "Дизайн жобаларын әзірлеу және шкаф жиһазын жобалау"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Подбор материалов и составление смет",
            "name_kz" => "Материалдарды таңдау және сметаларды жасау"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Применение методов для решения нестандартных задач",
            "name_kz" => "Стандартты емес есептерді шешу әдістерін қолдану"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Детализация компонентов мебели",
            "name_kz" => "Жиһаз компоненттерінің егжей-тегжейлері"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Планирование и создание карты кроя для листовых материалов",
            "name_kz" => "Парақ материалдары үшін кесу картасын жоспарлау және құру"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Освоение техник распилки и обработки материалов",
            "name_kz" => "Материалдарды аралау және өңдеу техникасын игеру"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Сборка и монтаж мебели на месте установки",
            "name_kz" => "Орнату орнында жиһазды құрастыру және монтаждау"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Организация и управление рабочим процессом",
            "name_kz" => "Жұмыс процесін ұйымдастыру және басқару"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/furniture1.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/furniture2.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/furniture3.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/furniture4.jpg"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Базарбеков',
            'last_name' => 'Марат',
            'middle_name' => 'Зияшевич',
            'description_ru' => '',
            'description_kz' => '',
            'image_url' => 'teachers/furniture-teacher.jpg'
        ]);
    }
}
