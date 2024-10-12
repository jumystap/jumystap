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
        Schema::table('organizations', function (Blueprint $table) {
            $table->foreign('resume_id', 'fk_organizations_resume_id')
                  ->references('id')->on('user_resumes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organization', function (Blueprint $table) {
            $table->dropForeign('fk_organizations_resume_id');
        });
    }
};
