<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeacherSkillsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teacher = DB::table("profession_teachers")->where("first_name", "Фарида")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Швейная фабрика «Ютария»",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Преподаватель колледжа «Швейное дело»",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);
        
        $teacher = DB::table("profession_teachers")->where("first_name", "Сәду")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Швейная фабрика «Ютария»",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Преподавание курсов по программе “Еңбек” по технологии швейного производства",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        $teacher = DB::table("profession_teachers")->where("first_name", "Тұрар")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Победитель чемпионата среди бариста «Monin Cup»",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Призер некоммерческого конкурса среди барист по LATTE ART",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        $teacher = DB::table("profession_teachers")->where("first_name", "Акмарал")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Многолетний опыт работы в сфере торговли",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Сертифицированные тренера по Soft & Hard Skills",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        $teacher = DB::table("profession_teachers")->where("first_name", "Базарбеков")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Опыт работы более 7-и лет в сфере изготовления корпусной мебели",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Автор индивидуальных курсов по изготовлению корпусной мебели",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        $teacher = DB::table("profession_teachers")->where("first_name", "Нурбаев")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Более 10-ти лет опыта в данной отрасли",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Основатель компании 'THE COBBLER'",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        $teacher = DB::table("profession_teachers")->where("first_name", "Есимсеитов")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "«Alstom Электровозосборочный завод» (ЭКЗ)»",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Мастер производственного обучения при политехническом колледже",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        $teacher = DB::table("profession_teachers")->where("first_name", "Кабдыгалиева")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Опыт работы более 6-и лет",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Основатель маркетингового агентства “OKNO Digital”",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        $teacher = DB::table("profession_teachers")->where("first_name", "Қапар")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Опыт работы более 3 лет",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Эксперт по мобилографии и SMM",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        $teacher = DB::table("profession_teachers")->where("first_name", "Иванков")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Опыт работы более 5-и лет",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Специалист по таргетированной рекламе и вирусному маркетингу",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        $teacher = DB::table("profession_teachers")->where("first_name", "Әждар")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Опыт работы более 6-и лет",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Директор агентства цифровых решений “DA Digital”",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        $teacher = DB::table("profession_teachers")->where("first_name", "Мурзабекова")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Опыт работы более 5-и лет",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Преподаватель-практик маркетингового агентства “Okno Digital”",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);
    
        $teacher = DB::table("profession_teachers")->where("first_name", "Сагнаева")->first();

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Опыт работы более 3 лет",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);

        DB::table("teacher_skills")->insert([
            "teacher_id" => $teacher->id,
            "name_ru" => "Преподаватель-практик маркетингового агентства “Okno Digital”",
            "name_kz" => "Швейная фабрика «Ютария»",
        ]);
    }
}
