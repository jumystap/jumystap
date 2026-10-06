<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('placement_surveys', function (Blueprint $table) {
            // Nullable: ответы, собранные до появления поля, остаются без компании.
            $table->string('company', 255)->nullable()->after('position');
        });
    }

    public function down(): void
    {
        Schema::table('placement_surveys', function (Blueprint $table) {
            $table->dropColumn('company');
        });
    }
};
