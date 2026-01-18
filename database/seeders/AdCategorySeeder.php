<?php

namespace Database\Seeders;

use App\Models\AdCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $categories = [
            [
                'name_ru' => 'Швейное дело',
                'name_kz' => 'Тігін ісі',
            ],
            [
                'name_ru' => 'Ремонт и изготовление на заказ',
                'name_kz' => 'Жөндеу және тапсырыспен әзірлеу',
            ],
            [
                'name_ru' => 'Цифровые услуги и сопровождение бизнеса',
                'name_kz' => 'Цифрлық қызметтер және бизнеске сүйемелдеу',
            ],
            [
                'name_ru' => 'Общественное питание',
                'name_kz' => 'Қоғамдық тамақтану',
            ],
            [
                'name_ru' => 'Услуги мастеров и иной сервис',
                'name_kz' => 'Шеберлер қызметі және өзге сервистер',
            ],
            [
                'name_ru' => 'Прочее',
                'name_kz' => 'Басқа',
            ],
        ];


        foreach ($categories as $value) {
            $item = AdCategory::query()->where(['name_ru' => $value['name_ru']])->first();

            if (!$item) {
                AdCategory::query()->create(
                    $value +
                    ['slug' => Str::slug($value['name_ru'])]
                );
            }
        }
    }

}
