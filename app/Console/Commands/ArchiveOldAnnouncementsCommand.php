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
    protected $description = 'Archive announcements not updated for more than 6 months';

    public function handle(): int
    {
        $date = Carbon::now()->subMonths(6);

        $count = Announcement::query()
            ->where('updated_at', '<', $date)
            ->update([
                'status' => AnnouncementStatus::ARCHIVED->value,
                'updated_at' => now(),
            ]);

        $this->info("Archived announcements: {$count}");

        return self::SUCCESS;
    }
}
