<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('placement_surveys', function (Blueprint $table) {
            $table->boolean('found_via_site')->default(false)->after('position');
        });
    }

    public function down(): void
    {
        Schema::table('placement_surveys', function (Blueprint $table) {
            $table->dropColumn('found_via_site');
        });
    }
};
