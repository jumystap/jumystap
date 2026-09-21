<?php

namespace App\Console\Commands;

use App\Enums\AnnouncementStatus;
use App\Models\Announcement;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ArchiveOldAnnouncementsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:announcements:archive-old';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archive announcements not updated for more than 3 months (except top, urgent and permanent)';

    public function handle(): int
    {
        $date = Carbon::now()->subMonths(3);

        $count = Announcement::query()
            ->where('updated_at', '<', $date)
            ->where('is_top', false)
            ->where('is_urgent', false)
            ->where('is_permanent', false)
            ->update([
                'status' => AnnouncementStatus::ARCHIVED->value,
                'updated_at' => now(),
            ]);

        $this->info("Archived announcements: {$count}");

        return self::SUCCESS;
    }
}
