<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE INDEX visits_url_index ON visits (url(191))');

        Schema::table('favorites', function (Blueprint $table) {
            $table->index(['user_id', 'announcement_id'], 'favorites_user_announcement_index');
        });

        Schema::table('announcements', function (Blueprint $table) {
            $table->index(['status', 'updated_at', 'published_at'], 'announcements_status_updated_published_index');
            $table->index(['status', 'specialization_id', 'published_at'], 'announcements_status_spec_published_index');
            $table->index(['status', 'payment_status', 'published_at'], 'announcements_status_payment_published_index');
            $table->index(['status', 'city', 'published_at'], 'announcements_status_city_published_index');
        });
    }

    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropIndex('announcements_status_city_published_index');
            $table->dropIndex('announcements_status_payment_published_index');
            $table->dropIndex('announcements_status_spec_published_index');
            $table->dropIndex('announcements_status_updated_published_index');
        });

        Schema::table('favorites', function (Blueprint $table) {
            $table->dropIndex('favorites_user_announcement_index');
        });

        Schema::table('visits', function (Blueprint $table) {
            $table->dropIndex('visits_url_index');
        });
    }
};
