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
        Schema::table('user_resumes', function (Blueprint $table) {
            $table->string('status', 20)->default('moderation')->after('about');
            $table->text('reject_reason')->nullable()->after('status');
            $table->timestamp('published_at')->nullable()->after('reject_reason');
            $table->index('status');
        });

        // Grandfather every existing resume as published so already-live
        // resumes stay visible after moderation is introduced.
        DB::table('user_resumes')->update([
            'status'       => 'active',
            'published_at' => DB::raw('COALESCE(published_at, created_at)'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_resumes', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropColumn(['status', 'reject_reason', 'published_at']);
        });
    }
};
