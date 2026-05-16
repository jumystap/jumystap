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
        Schema::table('users', function (Blueprint $table) {
            $table->index(['role_id', 'status'], 'users_role_status_idx');
            $table->index(['role_id', 'is_graduate'], 'users_role_graduate_idx');
        });

        Schema::table('user_professions', function (Blueprint $table) {
            $table->index(['user_id', 'profession_id'], 'user_professions_user_profession_idx');
            $table->index(['profession_id', 'user_id'], 'user_professions_profession_user_idx');
        });

        Schema::table('user_resumes', function (Blueprint $table) {
            $table->index(['user_id', 'updated_at'], 'user_resumes_user_updated_idx');
            $table->index(['user_id', 'created_at'], 'user_resumes_user_created_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_resumes', function (Blueprint $table) {
            $table->dropIndex('user_resumes_user_updated_idx');
            $table->dropIndex('user_resumes_user_created_idx');
        });

        Schema::table('user_professions', function (Blueprint $table) {
            $table->dropIndex('user_professions_user_profession_idx');
            $table->dropIndex('user_professions_profession_user_idx');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_role_status_idx');
            $table->dropIndex('users_role_graduate_idx');
        });
    }
};
