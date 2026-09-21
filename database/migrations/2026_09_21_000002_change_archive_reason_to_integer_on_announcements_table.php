<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Legacy string reason -> numeric enum value.
     */
    private array $map = [
        'found_on_site' => 1,
        'found_other_platform' => 2,
        'no_longer_relevant' => 3,
    ];

    public function up(): void
    {
        // Convert existing string values to their numeric equivalents while the
        // column is still a string, so the type change coerces cleanly.
        foreach ($this->map as $string => $int) {
            DB::table('announcements')
                ->where('archive_reason', $string)
                ->update(['archive_reason' => $int]);
        }

        Schema::table('announcements', function (Blueprint $table) {
            $table->unsignedTinyInteger('archive_reason')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->string('archive_reason')->nullable()->change();
        });

        foreach ($this->map as $string => $int) {
            DB::table('announcements')
                ->where('archive_reason', (string) $int)
                ->update(['archive_reason' => $string]);
        }
    }
};
