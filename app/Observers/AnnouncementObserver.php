<?php

namespace App\Observers;

use App\Models\Announcement;
use App\Models\AnnouncementHistory;

class AnnouncementObserver
{
    /**
     * Handle the Announcement "created" event.
     */
    public function created(Announcement $announcement): void
    {
        AnnouncementHistory::query()->create(['announcement_id' => $announcement->id, 'status' => $announcement->status]);
    }

    /**
     * Handle the Announcement "updated" event.
     */
    public function updated(Announcement $announcement): void
    {
        AnnouncementHistory::query()->create(['announcement_id' => $announcement->id, 'status' => $announcement->status]);
    }

    /**
     * Handle the Announcement "deleted" event.
     */
    public function deleted(Announcement $announcement): void
    {
        //
    }

    /**
     * Handle the Announcement "restored" event.
     */
    public function restored(Announcement $announcement): void
    {
        //
    }

    /**
     * Handle the Announcement "force deleted" event.
     */
    public function forceDeleted(Announcement $announcement): void
    {
        //
    }
}
