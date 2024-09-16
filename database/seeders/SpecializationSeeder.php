<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpecializationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category_id = DB::table('specialization_categories')->where('name_ru', 'Швейное дело')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Швея', 'name_kz' => 'Швея', 'category_id' => $category_id],
            ['name_ru' => 'Закройщик', 'name_kz' => 'Швея', 'category_id' => $category_id],
            ['name_ru' => 'Ткач', 'name_kz' => 'Швея', 'category_id' => $category_id],
        ]);
    }
}
