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
            ['name_ru' => 'Торговля и продажи', 'name_kz' => 'Қоғамдық тамақтану'],
            ['name_ru' => 'Общепит', 'name_kz' => 'Қоғамдық тамақтану'],
            ['name_ru' => 'Общепит', 'name_kz' => 'Қоғамдық тамақтану'],
            ['name_ru' => 'Общепит', 'name_kz' => 'Қоғамдық тамақтану'],
        ];

        DB::table('specialization_category')->insert($categories);
    }
}
