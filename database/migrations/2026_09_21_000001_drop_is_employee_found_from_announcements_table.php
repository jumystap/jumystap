<?php

use App\Enums\AnnouncementArchiveReason;
use App\Enums\AnnouncementStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Preserve the only reliably recoverable signal from the legacy boolean:
        // is_employee_found = true means the employee was found via the site.
        // The false case did not distinguish "other platform" from "not relevant",
        // so those rows are intentionally left with a null (unknown) reason.
        DB::table('announcements')
            ->where('status', AnnouncementStatus::ARCHIVED->value)
            ->whereNull('archive_reason')
            ->where('is_employee_found', true)
            ->update(['archive_reason' => AnnouncementArchiveReason::FOUND_ON_SITE->value]);

        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn('is_employee_found');
        });
    }

    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->boolean('is_employee_found')->default(false)->after('is_urgent');
        });

        DB::table('announcements')
            ->where('archive_reason', AnnouncementArchiveReason::FOUND_ON_SITE->value)
            ->update(['is_employee_found' => true]);
    }
};
