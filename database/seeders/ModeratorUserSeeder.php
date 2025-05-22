<?php

namespace Database\Seeders;

use App\Enums\Roles;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ModeratorUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Moderator User',
            'email' => 'moderator@example.com',
            'phone' => '77777777777',
            'password' => Hash::make('123456'),
            'role_id' => Roles::MODERATOR->value,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
