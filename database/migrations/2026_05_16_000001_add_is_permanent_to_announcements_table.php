<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->boolean('is_permanent')->default(false)->after('is_urgent');
        });

        $announcementIds = [
            6,
            5973,
            5974,
            5799,
            5788,
            5783,
            5980,
            5114,
            3588,
            3587,
            5970,
            5971,
            5972,
            5793,
            5802,
            5796,
            5982,
            5092,
            5969,
            3590,
            5976,
            5790,
            5787,
            5981,
            5977,
            5800,
            5979,
            3586,
            5975,
            55,
            6048,
        ];

        DB::table('announcements')
            ->whereIn('id', $announcementIds)
            ->update(['is_permanent' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn('is_permanent');
        });
    }
};
