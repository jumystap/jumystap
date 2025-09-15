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
            "Алматы", "Астана", "Шымкент", "Актау", "Атырау", "Жезказган", "Караганда", "Косшы", "Костанай",
            "Кызылорда", "Павлодар", "Петропавловск", "Рудный", "Семей", "Талдыкорган", "Тараз", "Темиртау",
            "Туркестан", "Уральск", "Усть-Каменогорск", "Щучинск", "Экибастуз"
        ];

        foreach ($cities as $key => $value) {
            City::query()->updateOrCreate(['title' => $value], [
                'title' => $value,
                'order_id' => $key
            ]);
        }
        City::query()->where(['title' => 'Актобе'])->delete();
    }
}
