<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProfessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stitch_model = DB::table('group_professions')->where('name', 'stitch-model')->first();
        DB::table('professions')->insert([
            'name_ru' => 'Швея 3-го разряда',
            'name_kz' => 'Тігінші (3-ші разряд)',
            'release_count' => 322,
            'icon_url' => 'professions/shveya.svg',
            'video_url' => 'https://www.instagram.com/p/C6WPFduiYjS/',
            'type' => 'work',
            'group_id' => $stitch_model->id,
        ]);

        DB::table('professions')->insert([
            'name_ru' => 'Модельер-конструктор',
            'name_kz' => 'Сәнгер-құрастырушы',
            'release_count' => 262,
            'icon_url' => 'professions/modelier.svg',
            'video_url' => 'https://www.instagram.com/p/C6oRwYhi9BX/',
            'type' => 'work',
            'group_id' => $stitch_model->id,
        ]);

        $barista = DB::table('group_professions')->where('name', 'barista')->first();
        DB::table('professions')->insert([
            'name_ru' => 'Бариста',
            'name_kz' => 'Бариста',
            'release_count' => 459,
            'icon_url' => 'professions/barista.svg',
            'video_url' => 'https://www.instagram.com/p/C7WoPg8ChWc/',
            'type' => 'work',
            'group_id' => $barista->id,
        ]);

        $kassir = DB::table('group_professions')->where('name', 'kassir')->first();
        DB::table('professions')->insert([
            'name_ru' => 'Продавец-кассир',
            'name_kz' => 'Сатушы-кассир',
            'release_count' => 305,
            'icon_url' => 'professions/kassir.svg',
            'video_url' => 'https://www.instagram.com/p/C6WPFduiYjS/',
            'type' => 'work',
            'group_id' => $kassir->id,
        ]);

        $mebel = DB::table('group_professions')->where('name', 'mebel')->first();
        DB::table('professions')->insert([
            'name_ru' => 'Основы изготовления корпусной мебели',
            'name_kz' => 'Корпустық жиһаз жасау негіздері',
            'release_count' => 20,
            'icon_url' => 'professions/mebel.svg',
            'video_url' => 'https://www.instagram.com/p/C76rRckiPRO/',
            'type' => 'work',
            'group_id' => $mebel->id,
        ]);

        $shoes = DB::table('group_professions')->where('name', 'shoes')->first();
        DB::table('professions')->insert([
            'name_ru' => 'Ремонт обуви и изготовление ключей',
            'name_kz' => 'Тігінші (3-ші разряд)',
            'release_count' => 20,
            'icon_url' => 'professions/shoes.svg',
            'video_url' => 'https://www.instagram.com/p/C6WPFduiYjS/',
            'type' => 'work',
            'group_id' => $shoes->id,
        ]);

        $svarshik = DB::table('group_professions')->where('name', 'svarshik')->first();
        DB::table('professions')->insert([
            'name_ru' => 'Электрогазосварщик 3-го разряда',
            'name_kz' => '3-ші разрядты электрогазбен дәнекерлеуші',
            'release_count' => 70,
            'icon_url' => 'professions/svarschik.svg',
            'video_url' => 'https://www.instagram.com/p/C9cjCdOCZdg/',
            'type' => 'work',
            'group_id' => $svarshik->id,
        ]);

        $buhuchet = DB::table('group_professions')->where('name', 'buhuchet')->first();
        DB::table('professions')->insert([
            'name_ru' => 'Основы бухгалтерского учета',
            'name_kz' => 'Бухгалтерлік есеп негіздері',
            'release_count' => 100,
            'icon_url' => 'professions/buhuchet.svg',
            'video_url' => 'https://www.instagram.com/p/C5lMDkhM68E/',
            'type' => 'work',
            'group_id' => $buhuchet->id,
        ]);

        $digital = DB::table('group_professions')->where('name', 'digital')->first();
        DB::table('professions')->insert([
            'name_ru' => 'SMM-специалист',
            'name_kz' => 'SMM-маманы',
            'release_count' => 423,
            'icon_url' => 'professions/smm.svg',
            'video_url' => 'https://www.instagram.com/p/C8PZrwsCC2d/',
            'type' => 'digital',
            'group_id' => $digital->id,
        ]);

        DB::table('professions')->insert([
            'name_ru' => 'Мобилография',
            'name_kz' => 'Мобилография',
            'release_count' => 724,
            'icon_url' => 'professions/mobile.svg',
            'video_url' => 'https://www.instagram.com/p/C7MNALTM9K-/',
            'type' => 'digital',
            'group_id' => $digital->id,
        ]);

        DB::table('professions')->insert([
            'name_ru' => 'Таргетолог',
            'name_kz' => 'Таргетолог',
            'release_count' => 496,
            'icon_url' => 'professions/target.svg',
            'video_url' => 'https://www.instagram.com/p/C8rzLYpCpuI/',
            'type' => 'digital',
            'group_id' => $digital->id,
        ]);

        DB::table('professions')->insert([
            'name_ru' => 'Графический дизайнер',
            'name_kz' => 'Графикалық дизайн',
            'release_count' => 158,
            'icon_url' => 'professions/design.svg',
            'video_url' => 'https://www.instagram.com/p/C6d2suJsEpf/',
            'type' => 'digital',
            'group_id' => $digital->id,
        ]);

        DB::table('professions')->insert([
            'name_ru' => 'Видеомонтаж',
            'name_kz' => 'Видеомонтаж',
            'release_count' => 143,
            'icon_url' => 'professions/video.svg',
            'video_url' => 'https://www.instagram.com/p/C8cBLIuoK72/',
            'type' => 'digital',
            'group_id' => $digital->id,
        ]);

        DB::table('professions')->insert([
            'name_ru' => 'Веб-дизайн и разработка сайтов',
            'name_kz' => 'Веб-дизайн және сайттар',
            'release_count' => 78,
            'icon_url' => 'professions/web-design.svg',
            'video_url' => 'https://www.instagram.com/joltap.kz/',
            'type' => 'digital',
            'group_id' => $digital->id,
        ]);
    }
}
