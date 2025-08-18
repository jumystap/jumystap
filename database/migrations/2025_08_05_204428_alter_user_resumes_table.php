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
        Schema::table('user_resumes', function (Blueprint $table) {
            $table->after('id', function ($table){
                $table->string('position')->nullable();
                $table->string('email')->nullable();
                $table->string('phone')->nullable();
            });
            $table->tinyInteger('education_level_id')->nullable()->after('district');
            $table->after('district', function ($table){
                $table->bigInteger('salary')->nullable();
                $table->tinyInteger('employment_type_id')->nullable();
                $table->tinyInteger('work_schedule_id')->nullable();
            });
            $table->string('desired_field')->nullable()->change();
            $table->string('education')->nullable()->change();
            $table->string('ip_status')->nullable()->change();
            $table->string('educational_institution')->nullable()->after('education');
            $table->after('ip_status', function ($table){
                $table->boolean('has_car')->nullable();
                $table->string('driving_license')->nullable();
            });
            $table->longText('about')->nullable()->after('photo_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
