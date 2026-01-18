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
        Schema::create('business_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('name_kz', 100)->unique();
            $table->timestamps();
        });

        Schema::create('ads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Тип объявления (STRING вместо ENUM!)
            $table->string('type', 20)->comment('service или product');

            // Основная информация
            $table->string('title', 80);
            $table->text('description');

            // Категории
            $table->integer('category_id');
            $table->integer('subcategory_id')->nullable();

            // Локация
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->string('address', 255)->nullable();
            $table->boolean('is_remote')->default(false);

            // Цена
            $table->decimal('price_from', 10, 2)->nullable();
            $table->decimal('price_to', 10, 2)->nullable();
            $table->decimal('price_exact', 10, 2)->nullable();
            $table->string('price_type', 20)->default('exact'); // STRING вместо ENUM!

            // Контактная информация
            $table->string('phone', 20)->nullable();
            $table->boolean('use_profile_phone')->default(true);

            // Информация о компании/авторе
            $table->text('company_description')->nullable();
            $table->foreignId('business_type_id')->nullable()->constrained('business_types')->onDelete('set null');

            // Статусы (STRING вместо ENUM!)
            $table->string('status', 20)->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            // Счетчики
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('contacts_shown_count')->default(0);

            $table->timestamps();
            $table->softDeletes();

            // Индексы для производительности
            $table->index(['type', 'status', 'published_at']);
            $table->index(['city_id', 'status']);
            $table->index('user_id');
            $table->index('status');
        });

        Schema::create('ad_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_id')->constrained('ads')->onDelete('cascade');
            $table->string('path', 500);
            $table->string('thumbnail_path', 500)->nullable();
            $table->unsignedTinyInteger('order')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->index(['ad_id', 'order']);
        });

        Schema::create('ad_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_id')->constrained('ads')->onDelete('cascade');
            $table->string('status_from', 20);
            $table->string('status_to', 20);
            $table->foreignId('changed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('comment')->nullable();
            $table->timestamp('changed_at');

            $table->index(['ad_id', 'changed_at']);
        });

        Schema::create('ad_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('ad_id')->constrained('ads')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'ad_id']);
        });

        Schema::create('ad_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_id')->constrained('ads')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('viewed_at');

            $table->index(['ad_id', 'viewed_at']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_views');
        Schema::dropIfExists('ad_favorites');
        Schema::dropIfExists('ad_status_histories');
        Schema::dropIfExists('ad_photos');
        Schema::dropIfExists('ads');
        Schema::dropIfExists('business_types');
    }
};
