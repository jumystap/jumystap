<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IndustrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('industries')->insert([
            [
                'name_kz' => 'Қызметтер (жүк тасушы, тазалаушы)',
                'name_ru' => 'Услуги (грузчик, уборщик)'
            ],
            [
                'name_kz' => 'Сауда (сатушы, кассир)',
                'name_ru' => 'Торговля (продавец, кассир)'
            ],
            [
                'name_kz' => 'Қоғамдық тамақтану (официант, аспаз)',
                'name_ru' => 'Общепит (официант, повар)'
            ],
            [
                'name_kz' => 'Өнеркәсіп және құрылыс (дәнекерлеуші, оператор)',
                'name_ru' => 'Промышленность и строительство (сварщик, оператор)'
            ],
            [
                'name_kz' => 'Цифрлық (дизайнер, СММ, таргет)',
                'name_ru' => 'Цифровые (дизайнер, СММ, таргет)'
            ],
            [
                'name_kz' => 'Тігін ісі (тігінші)',
                'name_ru' => 'Швейное дело (швеи)'
            ],
            [
                'name_kz' => 'Көлік (жүргізуші, курьер)',
                'name_ru' => 'Транспорт (водитель, курьер)'
            ],
            [
                'name_kz' => 'Жиһаз ісі',
                'name_ru' => 'Мебельное дело'
            ]
        ]);
    }
}
