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
        Schema::table('announcements', function (Blueprint $table) {
            $table->string('experience')->default('Без опыта работы');
            $table->string('education')->default('Не требуется');
            $table->string('employemnt_type')->default('Полный день');
            $table->string('work_hours')->nullable();
            $table->string('start_time')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            //
        });
    }
};
