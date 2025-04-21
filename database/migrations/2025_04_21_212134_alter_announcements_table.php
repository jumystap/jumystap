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
            $table->timestamp('published_at')->nullable()->after('active');
            $table->renameColumn('active', 'status');
        });

        DB::statement('UPDATE announcements SET published_at = created_at');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
