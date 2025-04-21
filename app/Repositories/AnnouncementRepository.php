<?php

namespace App\Repositories;

use App\Enums\AnnouncementStatus;
use App\Models\Announcement;
use App\Models\Specialization;
use App\Models\Favorite;
use App\Models\Response;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AnnouncementRepository
{
    public function getAllActiveAnnouncements(array $filters = null)
    {
        $query = Announcement::orderBy('published_at', 'desc')
        ->with('user')
        ->where("status", AnnouncementStatus::ACTIVE->value);

        if (!empty($filters['searchKeyword'])) {
            $keyword = $filters['searchKeyword'];

            $query->where(function($query) use ($keyword) {
                $query->where('title', 'LIKE', "%{$keyword}%")
                      ->orWhere('description', 'LIKE', "%{$keyword}%");
            });
        }

        if (!empty($filters['specialization'])) {
            if (str_contains($filters['specialization'], '_')) {
                $specializationCategoryId = str_replace('_', '', $filters['specialization']);
                $specializationIds = Specialization::where('category_id', $specializationCategoryId)->get()->pluck('id')->toArray();
                $query->whereIn('specialization_id', $specializationIds);
            }else{
                $query->where('specialization_id', $filters['specialization']);
            }
        }

        // Filter by city
        if (!empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        // Filter by minimum salary
        if (!empty($filters['minSalary'])) {
            $query->where('cost', '>=', $filters['minSalary']);
        }

        // Filter announcements with a salary
        if (!empty($filters['isSalary'])) {
            if($filters['isSalary'] == 'true'){
                $query->where('salary_type', '!=', 'undefined');
            }
        }

        if (!empty($filters['noExperience'])) {
            if($filters['noExperience'] == 'true'){
                $query->where('experience', 'Без опыта работы');
            }
        }

        // Filter by publication time
        if (!empty($filters['publicTime'])) {
            $query->where('created_at', '>=', $filters['publicTime']);
        }

        return $query->paginate(10);
    }

    public function getAllActiveAnnouncementsWithout(int $id, int $specializationId)
    {
        $query = Announcement::orderBy('published_at', 'desc')
            ->with('user')
            ->where('id', '!=', $id)
            ->where('specialization_id', $specializationId)
            ->where("status", AnnouncementStatus::ACTIVE->value);

        return $query->limit(6)->get();
    }

    public function getAllActiveAnnouncementsByIds(array $ids): LengthAwarePaginator
    {
        return Announcement::query()->orderBy('published_at', 'desc')
            ->with('user')
            ->where("status", AnnouncementStatus::ACTIVE->value)
            ->whereIn('id', $ids)
            ->paginate(10);
    }


    public function getAnnouncementById($id): ?Announcement
    {
        $announcement = Announcement::where('id', $id)->with('user.announcement', 'address', 'conditions', 'requirements', 'responsibilities')->first();

        if ($announcement) {
            $is_favorite = Favorite::where('user_id', Auth::id())->where('announcement_id', $announcement->id)->exists();
            $announcement->is_favorite = $is_favorite;
            $announcement->specialization = Specialization::find($announcement->specialization_id);

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

