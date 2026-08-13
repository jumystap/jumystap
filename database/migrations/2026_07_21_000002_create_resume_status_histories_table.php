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
        Schema::create('resume_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_resume_id')->constrained('user_resumes')->onDelete('cascade');
            $table->string('status_from', 20)->nullable();
            $table->string('status_to', 20);
            $table->foreignId('changed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('comment')->nullable();
            $table->timestamp('changed_at');

            $table->index(['user_resume_id', 'changed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resume_status_histories');
    }
};
