<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('ip')->nullable()->default(null)->change();
            $table->string('ip_kz')->nullable()->default(null)->change();
            $table->string('status')->nullable()->default(null)->change();
            $table->string('status_kz')->nullable()->default(null)->change();
            $table->string('work_status')->nullable()->default(null)->change();
            $table->string('work_status_kz')->nullable()->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')->whereNull('ip')->update(['ip' => 'Нет ИП']);
        DB::table('users')->whereNull('ip_kz')->update(['ip_kz' => 'ЖК жоқ']);
        DB::table('users')->whereNull('status')->update(['status' => 'Не в активном поиске']);
        DB::table('users')->whereNull('status_kz')->update(['status_kz' => 'Жұмыс іздеп жүрген жоқпын']);
        DB::table('users')->whereNull('work_status')->update(['work_status' => 'Я ищу постоянную работу']);
        DB::table('users')->whereNull('work_status_kz')->update(['work_status_kz' => 'Мен тұрақты жұмыс іздеймін']);

        Schema::table('users', function (Blueprint $table) {
            $table->string('ip')->nullable(false)->default('Нет ИП')->change();
            $table->string('ip_kz')->nullable(false)->default('ЖК жоқ')->change();
            $table->string('status')->nullable(false)->default('Не в активном поиске')->change();
            $table->string('status_kz')->nullable(false)->default('Жұмыс іздеп жүрген жоқпын')->change();
            $table->string('work_status')->nullable(false)->default('Я ищу постоянную работу')->change();
            $table->string('work_status_kz')->nullable(false)->default('Мен тұрақты жұмыс іздеймін')->change();
        });
    }
};
