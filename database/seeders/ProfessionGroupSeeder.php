<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProfessionGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('group_professions')->insert([
            'name' => 'stitch-model',
        ]);

        DB::table('group_professions')->insert([
            'name' => 'barista',
        ]);

        DB::table('group_professions')->insert([
            'name' => 'kassir',
        ]);

        DB::table('group_professions')->insert([
            'name' => 'mebel',
        ]);

        DB::table('group_professions')->insert([
            'name' => 'shoes',
        ]);

        DB::table('group_professions')->insert([
            'name' => 'svarshik',
        ]);

        DB::table('group_professions')->insert([
            'name' => 'buhuchet',
        ]);

        DB::table('group_professions')->insert([
            'name' => 'digital',
        ]);

    }
}
