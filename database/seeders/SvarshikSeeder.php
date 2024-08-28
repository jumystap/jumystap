<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SvarshikSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profession = DB::table('professions')->where('name_ru', 'Электрогазосварщик 3-го разряда')->first();

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Техника сварки в различных пространственных положениях, включая нижний шов, вертикальные и горизонтальные швы",
            "name_kz" => "Төменгі тігісті, тік және көлденең тігістерді қоса алғанда, әртүрлі кеңістіктік позицияларда дәнекерлеу әдістерін меңгерген"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Использование электроинструментов, такие как болгарка и углошлифовальная машина",
            "name_kz" => "Тегістеуіш және бұрыштық тегістеуіш сияқты электр құралдарын қолдана алады"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Сварка металлов в стыковом, угловом, торцевом и тавровом положениях",
            "name_kz" => "Металдарды түйісу, бұрыштық, шеткі және тавр позицияларында дәнекерлеуді орындайды;"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Основы электротехники и материаловедения",
            "name_kz" => "Электротехника және материалтану негіздері"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Владение оборудованием и технологиями работы с полуавтоматической сваркой, включая общие сведения, принципы питания и монтажа",
            "name_kz" => "Жартылай автоматты дәнекерлеумен жұмыс істеуге арналған жабдықтар мен технологияларды, соның ішінде жалпы ақпаратты, электрмен жабдықтау және орнату принциптерін білу."
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Обладание знаниями в области оборудования и технологий автоматической и полуавтоматической сварки",
            "name_kz" => "Автоматты және жартылай автоматты дәнекерлеудің жабдықтары мен технологиялары саласында білімнің болуы"
        ]);

        DB::table('profession_skills')->insert([
            'profession_id' => $profession->id,
            'name_ru' => "Работа с оборудованием и технологиями ручной дуговой сварки (РДС)",
            "name_kz" => "Қолмен доғалық дәнекерлеу (РДС) жабдықтарымен және технологияларымен жұмыс істеу"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/keys1.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/welder2.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/welder3.jpg"
        ]);

        DB::table('profession_images')->insert([
            'profession_id' => $profession->id,
            'image_url' => "professions/welder4.jpg"
        ]);

        DB::table('profession_teachers')->insert([
            'profession_id' => $profession->id,
            'first_name' => 'Есимсеитов',
            'last_name' => 'Ербол',
            'middle_name' => 'Есенович',
            'description_ru' => 'Сертифицированный преподаватель-практик по программе учебно-экспертного центра Unobtanium, основанной на международных стандартах Mig/Mag сварки. Аттестованный инженер-сварщик IV-уровня. Имеет 18-ти летний опыт работы как на производстве, так и в преподавании:',
            'description_kz' => 'Оқытушы-практик, 14 жылдан астам тәжірибесі бар:',
            'image_url' => 'teachers/welder-teacher.jpg'
        ]);
    }
}
