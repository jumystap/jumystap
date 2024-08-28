<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Models\Favorite;
use App\Models\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AnnouncementRepository
{
    public function getAnnouncementById($id): Announcement
    {
        $announcement = Announcement::where('id', $id)->where('active', 1)->with('user.announcement')->first();

        $is_favorite = false;

        if(Favorite::where('user_id', Auth::id())->where('announcement_id', $announcement->id)->first()){
            $is_favorite = true;
        }

        $announcement->is_favorite = $is_favorite;

        $announcement->responses_count = Response::where('announcement_id', $announcement->id)->count();
        $announcement->visits_count = DB::table('visits')
                ->where('url', "https://jumystap.kz/announcement/{$announcement->id}")
                ->count();

        return $announcement;
    }

}
