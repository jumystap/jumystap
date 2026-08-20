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
        Schema::create('announcement_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('announcement_id')->constrained('announcements')->onDelete('cascade');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('device_type')->nullable();
            // Ссылка на исходную строку visits — делает бэкфилл идемпотентным (insertOrIgnore).
            // У «живых» записей из middleware остаётся null.
            $table->unsignedBigInteger('source_visit_id')->nullable()->unique();
            // Сохраняем исходное время визита (для истории); timestamps не используем.
            $table->timestamp('created_at')->nullable();

            $table->index(['announcement_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcement_visits');
    }
};
