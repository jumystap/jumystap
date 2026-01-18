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
        Schema::create('ad_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name_ru', 100);
            $table->string('name_kz', 100);
            $table->string('slug', 100)->unique();
            $table->foreignId('parent_id')->nullable()->constrained('ad_categories')->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['parent_id', 'is_active']);
        });

        Schema::table('ads', function (Blueprint $table){
            $table->dropForeign(['subcategory_id']);
            $table->dropIndex(['category_id', 'status']);
            $table->dropColumn(['category_id']);
        });

        Schema::table('ads', function (Blueprint $table){
            $table->after('description', function (Blueprint $table){
                $table->foreignId('category_id')->nullable()->constrained('ad_categories')->onDelete('restrict');
                $table->foreignId('subcategory_id')->nullable()->constrained('ad_categories')->onDelete('set null');
            });
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_categories');
    }
};
