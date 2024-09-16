<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpecializationCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name_ru' => 'Швейное дело', 'name_kz' => 'Тігін ісі'],
            ['name_ru' => 'Общепит', 'name_kz' => 'Қоғамдық тамақтану'],
            ['name_ru' => 'Торговля и продажи', 'name_kz' => 'Сауда және сату'],
            ['name_ru' => 'Сварщики', 'name_kz' => 'Дәнекерлеушілер'],
            ['name_ru' => 'Образование', 'name_kz' => 'Білім'],
            ['name_ru' => 'Рабочий и тех. персонал', 'name_kz' => 'Жұмысшы және техникалық қызметкерлер'],
            ['name_ru' => 'Медицина, фармацевтика', 'name_kz' => 'Медицина, фармацевтика'],
            ['name_ru' => 'Транспорт', 'name_kz' => 'Көлік'],
            ['name_ru' => 'Финансы и право', 'name_kz' => 'Қаржы және құқық'],
            ['name_ru' => 'Курьеры', 'name_kz' => 'Курьерлер'],
            ['name_ru' => 'Салон красоты, фитнес, спорт', 'name_kz' => 'Сұлулық салоны, фитнес, спорт'],
            ['name_ru' => 'Туризм, гостиницы, рестораны', 'name_kz' => 'Туризм, қонақ үйлер, мейрамханалар'],
            ['name_ru' => 'Производство', 'name_kz' => 'Өндіріс'],
            ['name_ru' => 'Строительство и ремонт', 'name_kz' => 'Құрылыс және жөндеу'],
            ['name_ru' => 'Офисная работа', 'name_kz' => 'Кеңсе жұмысы'],
            ['name_ru' => 'Маркетинг и PR', 'name_kz' => 'Маркетинг және PR'],
            ['name_ru' => 'Автосервис', 'name_kz' => 'Автосервис'],
            ['name_ru' => 'Бариста', 'name_kz' => 'Бариста'],
            ['name_ru' => 'Развлечения', 'name_kz' => 'Ойын-сауық'],
            ['name_ru' => 'IT', 'name_kz' => 'IT'],
        ];

        DB::table('specialization_categories')->insert($categories);
    }
}
