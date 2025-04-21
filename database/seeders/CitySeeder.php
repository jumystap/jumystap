<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $cities = [
            "Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Тараз",
            "Павлодар", "Усть-Каменогорск", "Семей", "Костанай", "Петропавловск",
            "Кызылорда", "Атырау", "Актау", "Уральск", "Темиртау", "Талдыкорган",
            "Экибастуз", "Рудный", "Жезказган"
        ];

        foreach ($cities as $value) {
            $city = City::query()->where('title', $value)->first();
            if (is_null($city)) {
                City::query()->create([
                    'title'       => $value,
                ]);
            }
        }
    }
}
