<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Models\Favorite;
use App\Models\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AnnouncementRepository
{
    public function getAllActiveAnnouncements()
    {
        return Announcement::where('active', 1)->get();
    }

    public function getAnnouncementById($id): ?Announcement
    {
        $announcement = Announcement::where('id', $id)->where('active', 1)->with('user.announcement')->first();

        if ($announcement) {
            $is_favorite = Favorite::where('user_id', Auth::id())->where('announcement_id', $announcement->id)->exists();
            $announcement->is_favorite = $is_favorite;

            $announcement->responses_count = Response::where('announcement_id', $announcement->id)->count();
            $announcement->visits_count = DB::table('visits')
                ->where('url', "https://jumystap.kz/announcement/{$announcement->id}")
                ->count();
        }

        return $announcement;
    }

    public function createAnnouncement(array $data): Announcement
    {
        return Announcement::create($data);
    }

    public function updateAnnouncement($id, array $data): bool
    {
        $announcement = Announcement::findOrFail($id);
        return $announcement->update($data);
    }

    public function deleteAnnouncement($id): bool
    {
        $announcement = Announcement::findOrFail($id);
        Response::where('announcement_id', $id)->delete();
        return $announcement->delete();
    }
}

