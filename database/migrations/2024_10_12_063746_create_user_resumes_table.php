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
        Schema::create('user_resumes', function (Blueprint $table) {
            $table->id();
            $table->string('city');
            $table->string('district')->nullable();
            $table->enum('education', ['Среднее', 'Среднее специальное', 'Неоконченное высшее', 'Высшее']);
            $table->string('faculty')->nullable();
            $table->string('specialization')->nullable();
            $table->year('graduation_year')->nullable();
            $table->enum('ip_status', ['Присутствует', 'Отсутствует']);
            $table->string('desired_field');
            $table->json('skills'); // Store as JSON array
            $table->string('photo_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_resumes');
    }
};
