<?php

namespace App\Console\Commands;

use App\Services\AnnouncementService;
use Illuminate\Console\Command;

class RepublishAnnouncementsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:announcements:republish';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Republish (bump to top) up to 5 promoted announcements (top/urgent/permanent) per day';

    public function __construct(private AnnouncementService $announcementService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $count = $this->announcementService->republishPromotedAnnouncements(5);

        $this->info("Republished announcements: {$count}");

        return self::SUCCESS;
    }
}
