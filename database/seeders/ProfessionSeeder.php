<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProfessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $professions = [
            [
                'id'            => 1,
                'group_id'      => 1,
                'name_kz'       => 'Тігінші (3-ші дәреже)',
                'name_ru'       => 'Швея 3-го разряда',
                'release_count' => 721,
                'icon_url'      => 'professions/shveya.svg',
                'video_url'     => 'https://www.instagram.com/p/C6WPFduiYjS/',
                'type'          => 'work',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 2,
                'group_id'      => 1,
                'name_kz'       => 'Сәнгер-құрастырушы',
                'name_ru'       => 'Модельер-конструктор',
                'release_count' => 262,
                'icon_url'      => 'professions/modelier.svg',
                'video_url'     => 'https://www.instagram.com/p/C6oRwYhi9BX/',
                'type'          => 'work',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 3,
                'group_id'      => 2,
                'name_kz'       => 'Бариста',
                'name_ru'       => 'Бариста',
                'release_count' => 493,
                'icon_url'      => 'professions/barista.svg',
                'video_url'     => 'https://www.instagram.com/p/C7WoPg8ChWc/',
                'type'          => 'work',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 4,
                'group_id'      => 3,
                'name_kz'       => 'Сатушы-кассир',
                'name_ru'       => 'Продавец-кассир',
                'release_count' => 375,
                'icon_url'      => 'professions/kassir.svg',
                'video_url'     => 'https://www.instagram.com/reel/C7RiVEVCMQR/?igsh=d3c0YTBsMzNwbnps',
                'type'          => 'work',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 5,
                'group_id'      => 4,
                'name_kz'       => 'Корпустық жиһаз жасау негіздері',
                'name_ru'       => 'Основы изготовления корпусной мебели',
                'release_count' => 44,
                'icon_url'      => 'professions/mebel.svg',
                'video_url'     => 'https://www.instagram.com/p/C76rRckiPRO/',
                'type'          => 'work',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 6,
                'group_id'      => 5,
                'name_kz'       => 'Аяқ киім жөндеу және кілттер жасау',
                'name_ru'       => 'Ремонт обуви и изготовление ключей',
                'release_count' => 21,
                'icon_url'      => 'professions/shoes.svg',
                'video_url'     => 'https://www.instagram.com/p/C6WPFduiYjS/',
                'type'          => 'work',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 7,
                'group_id'      => 6,
                'name_kz'       => '3-ші дәрежедегі электрогазбен дәнекерлеуші',
                'name_ru'       => 'Электрогазосварщик 3-го разряда',
                'release_count' => 97,
                'icon_url'      => 'professions/svarschik.svg',
                'video_url'     => 'https://www.instagram.com/p/C9cjCdOCZdg/',
                'type'          => 'work',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 8,
                'group_id'      => 7,
                'name_kz'       => 'Бухгалтерлік есеп негіздері',
                'name_ru'       => 'Основы бухгалтерского учета',
                'release_count' => 242,
                'icon_url'      => 'professions/buhuchet.svg',
                'video_url'     => 'https://www.instagram.com/p/C5lMDkhM68E/',
                'type'          => 'work',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 9,
                'group_id'      => 8,
                'name_kz'       => 'SMM-маманы',
                'name_ru'       => 'SMM-специалист',
                'release_count' => 423,
                'icon_url'      => 'professions/smm.svg',
                'video_url'     => 'https://www.instagram.com/p/C8PZrwsCC2d/',
                'type'          => 'digital',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 10,
                'group_id'      => 8,
                'name_kz'       => 'Мобилография',
                'name_ru'       => 'Мобилография',
                'release_count' => 724,
                'icon_url'      => 'professions/mobile.svg',
                'video_url'     => 'https://www.instagram.com/p/C7MNALTM9K-/',
                'type'          => 'digital',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 11,
                'group_id'      => 8,
                'name_kz'       => 'Таргетолог',
                'name_ru'       => 'Таргетолог',
                'release_count' => 496,
                'icon_url'      => 'professions/target.svg',
                'video_url'     => 'https://www.instagram.com/p/C8rzLYpCpuI/',
                'type'          => 'digital',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 12,
                'group_id'      => 8,
                'name_kz'       => 'Графикалық дизайн',
                'name_ru'       => 'Графический дизайнер',
                'release_count' => 158,
                'icon_url'      => 'professions/design.svg',
                'video_url'     => 'https://www.instagram.com/p/C6d2suJsEpf/',
                'type'          => 'digital',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 13,
                'group_id'      => 8,
                'name_kz'       => 'Видеомонтаж',
                'name_ru'       => 'Видеомонтаж',
                'release_count' => 143,
                'icon_url'      => 'professions/video.svg',
                'video_url'     => 'https://www.instagram.com/p/C8cBLIuoK72/',
                'type'          => 'digital',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 14,
                'group_id'      => 8,
                'name_kz'       => 'Веб-дизайн және сайттарды әзірлеу',
                'name_ru'       => 'Веб-дизайн и разработка сайтов',
                'release_count' => 78,
                'icon_url'      => 'professions/web-design.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'digital',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 15,
                'group_id'      => 8,
                'name_kz'       => 'Wildberries-те тауар сату',
                'name_ru'       => 'Продажи на Wildberries',
                'release_count' => 132,
                'icon_url'      => 'professions/wb.svg',
                'video_url'     => '',
                'type'          => 'digital',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 16,
                'group_id'      => 8,
                'name_kz'       => 'Негізгі цифрлық дағдылар',
                'name_ru'       => 'Базовые цифровые навыки',
                'release_count' => 132,
                'icon_url'      => 'professions/digital.svg',
                'video_url'     => '',
                'type'          => 'digital',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 17,
                'group_id'      => 8,
                'name_kz'       => 'Контент-криэйтор',
                'name_ru'       => 'Контент-криэйтор',
                'release_count' => 7,
                'icon_url'      => 'professions/digital.svg',
                'video_url'     => '',
                'type'          => 'digital',
                'created_at'    => '2024-09-13 19:53:28',
                'updated_at'    => '2024-09-13 19:53:29'
            ],
            [
                'id'            => 18,
                'group_id'      => 8,
                'name_kz'       => 'Kaspi дүкеніндегі сауда негіздері',
                'name_ru'       => 'Основы торговли на Kaspi магазине',
                'release_count' => 0,
                'icon_url'      => 'professions/digital.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'digital',
                'created_at'    => '2025-04-29 17:40:31',
                'updated_at'    => '2025-04-29 17:40:31'
            ],
            [
                'id'            => 19,
                'group_id'      => 9,
                'name_kz'       => 'Автокөлік майы мен шинасын ауыстыру жөніндегі маман',
                'name_ru'       => 'Автоспециалист по замене масла и автошин',
                'release_count' => 0,
                'icon_url'      => 'professions/svarschik.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'work',
                'created_at'    => '2025-04-29 17:40:31',
                'updated_at'    => '2025-04-29 17:40:31'
            ],
            [
                'id'            => 20,
                'group_id'      => 9,
                'name_kz'       => 'Полимерлі ұнтақ бояу маманы',
                'name_ru'       => 'Маляр по полимерно-порошковой покраске',
                'release_count' => 0,
                'icon_url'      => 'professions/svarschik.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'work',
                'created_at'    => '2025-07-15 23:57:41',
                'updated_at'    => '2025-07-15 23:57:41'
            ],
            [
                'id'            => 21,
                'group_id'      => 10,
                'name_kz'       => 'Тұрғын үй ішін жобалаудың негіздері ',
                'name_ru'       => 'Основы дизайна интерьера жилых помещений',
                'release_count' => 0,
                'icon_url'      => 'professions/design.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'work',
                'created_at'    => '2024-08-01 11:06:02',
                'updated_at'    => '2024-08-01 11:06:02'
            ],
            [
                'id'            => 22,
                'group_id'      => 10,
                'name_kz'       => 'Сату менеджері',
                'name_ru'       => 'Менеджер по продажам',
                'release_count' => 0,
                'icon_url'      => 'professions/design.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'work',
                'created_at'    => now(),
                'updated_at'    => now()
            ],
            [
                'id'            => 23,
                'group_id'      => 10,
                'name_kz'       => 'Наубайшы ',
                'name_ru'       => 'Пекарь',
                'release_count' => 0,
                'icon_url'      => 'professions/design.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'work',
                'created_at'    => now(),
                'updated_at'    => now()
            ],
            [
                'id'            => 24,
                'group_id'      => 10,
                'name_kz'       => '2-разрядты электр монтаждаушы',
                'name_ru'       => 'Электромонтажник 2-го разряда',
                'release_count' => 0,
                'icon_url'      => 'professions/design.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'work',
                'created_at'    => now(),
                'updated_at'    => now()
            ],
            [
                'id'            => 25,
                'group_id'      => 8,
                'name_kz'       => 'Искусственный интеллект для торговли и бизнеса',
                'name_ru'       => 'Искусственный интеллект для торговли и бизнеса',
                'release_count' => 0,
                'icon_url'      => 'professions/design.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'digital',
                'created_at'    => now(),
                'updated_at'    => now()
            ],
            [
                'id'            => 26,
                'group_id'      => 8,
                'name_kz'       => 'Разработка сайтов',
                'name_ru'       => 'Разработка сайтов',
                'release_count' => 0,
                'icon_url'      => 'professions/design.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'digital',
                'created_at'    => now(),
                'updated_at'    => now()
            ],
            [
                'id'            => 27,
                'group_id'      => 8,
                'name_kz'       => 'Графический дизайн',
                'name_ru'       => 'Графический дизайн',
                'release_count' => 0,
                'icon_url'      => 'professions/design.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'digital',
                'created_at'    => now(),
                'updated_at'    => now()
            ],
            [
                'id'            => 28,
                'group_id'      => 8,
                'name_kz'       => 'Универсальный сотрудник общепита (официант, администратор)',
                'name_ru'       => 'Универсальный сотрудник общепита (официант, администратор)',
                'release_count' => 0,
                'icon_url'      => 'professions/design.svg',
                'video_url'     => 'https://www.instagram.com/joltap.kz/',
                'type'          => 'work',
                'created_at'    => now(),
                'updated_at'    => now()
            ],
        ];

        foreach ($professions as $profession) {
            DB::table('professions')->updateOrInsert(
                ['id' => $profession['id']],
                $profession
            );
        }
    }
}
