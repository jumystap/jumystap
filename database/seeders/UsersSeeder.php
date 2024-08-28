<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employeeRole = DB::table('roles')->where('name', 'employee')->first();

        $faker = Faker::create();

        for ($i = 0; $i < 500; $i++) {
            DB::table('users')->insert([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'phone' => $faker->phoneNumber,
                'password' => Hash::make('password'), // You can change this password
                'role_id' => $employeeRole->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
