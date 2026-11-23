<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * `ip_status` оставался строкой (varchar) ещё со времён enum «Присутствует»/«Отсутствует»,
     * хотя хранит те же 0/1, что и boolean-колонка `has_car`. В Inertia-props значение уезжало
     * строкой "0", а в JS "0" истинно — страница резюме показывала «Наличие ИП: Да» у всех,
     * кто выбрал «Отсутствует». Приводим колонку к boolean, как у `has_car`.
     */
    public function up(): void
    {
        // На проде (проверено 2026-11-23) только '0', '1' и NULL: старые подписи enum перевела
        // ещё 2025_08_05_205251_fix_user_resumes. Страховка на случай мусора: в строгом режиме
        // MySQL смена типа падает на любом нечисловом значении, а entrypoint запускает migrate
        // под set -e — контейнер бы не поднялся.
        DB::table('user_resumes')
            ->whereNotNull('ip_status')
            ->whereNotIn('ip_status', ['0', '1'])
            ->update(['ip_status' => null]);

        Schema::table('user_resumes', function (Blueprint $table) {
            $table->boolean('ip_status')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('user_resumes', function (Blueprint $table) {
            $table->string('ip_status')->nullable()->change();
        });
    }
};
