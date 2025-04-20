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
        Schema::table('user_professions', function (Blueprint $table) {
            $table->dropColumn(['created_at', 'updated_at']);

            $table->after('id', function ($table){
                $table->string('type')->nullable();
                $table->bigInteger('bitrix_id')->nullable();
            });
            $table->string('certificate_link', 1000)->nullable()->after('certificate_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_professions', function (Blueprint $table) {
            //
        });
    }
};
