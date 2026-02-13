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
        Schema::table('ads', function (Blueprint $table) {
            $table->string('instagram')->nullable()->after('phone');
            $table->string('tiktok')->nullable()->after('instagram');
            $table->string('twogis')->nullable()->after('tiktok');
            $table->string('site')->nullable()->after('twogis');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ads', function (Blueprint $table) {
            $table->dropColumn(['instagram', 'tiktok', 'twogis', 'site']);
        });
    }
};
