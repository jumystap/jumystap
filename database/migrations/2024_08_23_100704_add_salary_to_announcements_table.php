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
            $table->string('salary_type')->default('exact');
            $table->unsignedBigInteger('cost_max')->nullable();
            $table->unsignedBigInteger('cost_min')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn('salary_type');
            $table->dropColumn('cost_max');
            $table->dropColumn('cost_min');
        });
    }
};
