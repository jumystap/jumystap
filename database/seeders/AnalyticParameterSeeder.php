<?php

namespace Database\Seeders;

use App\Models\AnalyticParameter;
use Illuminate\Database\Seeder;

class AnalyticParameterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $titles = [
            [
                'title' => 'Youtube баннер'
            ],
        ];

        foreach ($titles as $value) {
            $item = AnalyticParameter::query()->where(['title' => $value['title']])->first();

            if (!$item) {
                AnalyticParameter::query()->create(['title' => $value['title']]);
            }
        }
    }
}
