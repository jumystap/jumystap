<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DigitaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profession = DB::table('professions')->where('name_ru', 'SMM-специалист')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Анализ рынка, конкурентов и целевой аудитории",
            "name_kz" => "Иық және белдік бұйымдарының негізін құру және модельдеудің негізгі дағдылары"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Разработка контент-плана",
            "name_kz" => "Торлардың сызбаларын салу, үлгілерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Разработка визуалов",
            "name_kz" => "Юбка, шалбар, көйлектер, жеңдер мен иық бұйымдарын модельдеу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Методы продвижения и поиск клиентов",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основы контент-маркетинга и стратегии контент-воронки",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Создание креативных и упаковочных материалов",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Навыки копирайтинга и сторисмейкинга",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Кабдыгалиева',
            'last_name' => 'Арай',
            'middle_name' => 'Аскаровна',
            'description_ru' => 'Основатель маркетингового агентства “OKNO Digital”',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/smm-teacher.jpg'
        ]);

        $profession = DB::table('professions')->where('name_ru', 'Мобилография')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Введение в мобилографию",
            "name_kz" => "Иық және белдік бұйымдарының негізін құру және модельдеудің негізгі дағдылары"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Использование приложений для монтажа видео",
            "name_kz" => "Торлардың сызбаларын салу, үлгілерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Монетизация навыков мобилографии",
            "name_kz" => "Юбка, шалбар, көйлектер, жеңдер мен иық бұйымдарын модельдеу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Подготовка к съемке (Pre-Production)",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Изучение трендов в социальных сетях",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/mobile1.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/mobile2.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/mobile3.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/mobile4.jpg"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Қапар',
            'last_name' => 'Камшат',
            'middle_name' => 'Ерболқызы',
            'description_ru' => 'Сертифицированный преподаватель-практик с опытом работы более 15-ти лет',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/mobile-teacher.jpg'
        ]);

        $profession = DB::table('professions')->where('name_ru', 'Таргетолог')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Создание аккаунтов в Instagram и Facebook с минимизацией рисков блокировок",
            "name_kz" => "Иық және белдік бұйымдарының негізін құру және модельдеудің негізгі дағдылары"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Освоение всех этапов создания рекламы, включая выбор целей, посадочных страниц, бюджета, аудиторий и мест размещения",
            "name_kz" => "Торлардың сызбаларын салу, үлгілерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Изучение трех основных стратегий продвижения в социальных сетях, связанных с таргетированием и контентом",
            "name_kz" => "Юбка, шалбар, көйлектер, жеңдер мен иық бұйымдарын модельдеу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Знакомство с основными вспомогательными инструментами для таргетолога",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Знакомство с ключевыми элементами рекламного кабинета",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Анализ рекламной статистики, включая сквозной и детальный анализ, отслеживание продаж",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Освоение 11 подходов в создании креативов для рекламных объявлений",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Иванков',
            'last_name' => 'Антон',
            'middle_name' => 'Олегович',
            'description_ru' => 'Специалист по таргетированной рекламе и вирусному маркетингу',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/target-teacher.jpg'
        ]);

        $profession = DB::table('professions')->where('name_ru', 'Графический дизайнер')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основные принципы графического дизайна, включая композицию, типографику и колористику",
            "name_kz" => "Иық және белдік бұйымдарының негізін құру және модельдеудің негізгі дағдылары"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Брендинг: базовые техники создания логотипов",
            "name_kz" => "Торлардың сызбаларын салу, үлгілерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Разработка дизайна баннеров, презентаций и графических материалов для публикаций",
            "name_kz" => "Юбка, шалбар, көйлектер, жеңдер мен иық бұйымдарын модельдеу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Составление портфолио и взаимодействие с клиентами",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/design1.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/design2.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/design3.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/design4.jpg"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Әждар',
            'last_name' => 'Дәулет',
            'middle_name' => '',
            'description_ru' => 'Директор агентства цифровых решений “DA Digital”',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/design-teacher.jpg'
        ]);

        $profession = DB::table('professions')->where('name_ru', 'Видеомонтаж')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основы видеомонтажа в программе Adobe Premiere Pro",
            "name_kz" => "Иық және белдік бұйымдарының негізін құру және модельдеудің негізгі дағдылары"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Пост-обработка (склейка, маскирование, цветокоррекция и др.)",
            "name_kz" => "Торлардың сызбаларын салу, үлгілерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Работа с материалами (видео, аудио, фото)",
            "name_kz" => "Юбка, шалбар, көйлектер, жеңдер мен иық бұйымдарын модельдеу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основные процессы видеопроизводства",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Мурзабекова',
            'last_name' => 'Сабина',
            'middle_name' => '',
            'description_ru' => 'Преподаватель-практик маркетингового агентства “Okno Digital”',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/video-teacher.jpg'
        ]);

        $profession = DB::table('professions')->where('name_ru', 'Веб-дизайн и разработка сайтов')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Разработка макета сайта на Figma (с использованием шаблонов)",
            "name_kz" => "Иық және белдік бұйымдарының негізін құру және модельдеудің негізгі дағдылары"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Понимание важных soft-skills для работы в данной сфере и способы вхождения в рынок фриланса",
            "name_kz" => "Торлардың сызбаларын салу, үлгілерді алу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Перенос макета сайта с Figma на Tilda",
            "name_kz" => "Юбка, шалбар, көйлектер, жеңдер мен иық бұйымдарын модельдеу"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Создание сайтов с использованием конструктора Tilda, включая добавление HTML-кода, SVG-анимации и step-by-step анимации",
            "name_kz" => "Өлшемдерді алу"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Сагнаева',
            'last_name' => 'Алина',
            'middle_name' => '',
            'description_ru' => 'Преподаватель-практик маркетингового агентства “Okno Digital”',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/website-teacher.jpg'
        ]);
    }
}
