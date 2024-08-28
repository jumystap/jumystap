<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('status_kz')->default('Жұмыс іздеп жүрген жоқпын');
            $table->string('work_status_kz')->default('Мен тұрақты жұмыс іздеймін');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIfExists('status_kz');
            $table->dropIfExists('work_status_kz');
        });
    }
};
