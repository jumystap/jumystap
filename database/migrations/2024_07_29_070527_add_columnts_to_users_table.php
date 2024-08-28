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
            $table->string('image_url')->default('/avatars/default.png');
            $table->string('status')->default('Не в активном поиске');
            $table->string('work_status')->default('Я ищу постоянную работу');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIfExists('image_url');
            $table->dropIfExists('status');
            $table->dropIfExists('work_status');
        });
    }
};
