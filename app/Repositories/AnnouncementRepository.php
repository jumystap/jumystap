<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Models\Specialization;
use App\Models\Favorite;
use App\Models\Response;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class AnnouncementRepository
{
    public function getAllActiveAnnouncements(array $filters = null)
    {
        $query = Announcement::query()
            ->recentActive()
            ->select([
                'id',
                'title',
                'city',
                'salary_type',
                'cost',
                'cost_min',
                'cost_max',
                'experience',
                'work_time',
                'updated_at',
                'published_at',
            ])
            ->orderBy('published_at', 'desc');

        if (!empty($filters['searchKeyword'])) {
            $keyword = $filters['searchKeyword'];

            $query->where(function ($query) use ($keyword) {
                $query->where('title', 'LIKE', "%{$keyword}%")
                    ->orWhere('description', 'LIKE', "%{$keyword}%");
            });
        }

        if (!empty($filters['specializations'])) {
            $query->whereIn('specialization_id', $filters['specializations']);
        } else {
            if (!empty($filters['specializationCategories'])) {
                $specializationIds = Specialization::where('category_id', $filters['specializationCategories'])->get()->pluck('id')->toArray();
                $query->whereIn('specialization_id', $specializationIds);
            }
        }


        // Filter by city
        if (!empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        // Filter by salary value, including exact salaries and salary ranges.
        if (isset($filters['minSalary']) && $filters['minSalary'] !== '' && is_numeric($filters['minSalary'])) {
            $salary = (int) $filters['minSalary'];

            $query->where(function ($query) use ($salary) {
                $query->where('cost', '>=', $salary)
                    ->orWhere(function ($query) use ($salary) {
                        $query->whereNotNull('cost_min')
                            ->whereNotNull('cost_max')
                            ->where('cost_min', '<=', $salary)
                            ->where('cost_max', '>=', $salary);
                    })
                    ->orWhere(function ($query) use ($salary) {
                        $query->whereNotNull('cost_min')
                            ->whereNull('cost_max')
                            ->where('cost_min', '<=', $salary);
                    })
                    ->orWhere(function ($query) use ($salary) {
                        $query->whereNull('cost_min')
                            ->whereNotNull('cost_max')
                            ->where('cost_max', '>=', $salary);
                    });
            });
        }

        // Filter announcements with a salary
        if (!empty($filters['isSalary'])) {
            if ($filters['isSalary'] == 'true') {
                $query->where('salary_type', '!=', 'undefined');
            }
        }

        if (!empty($filters['noExperience'])) {
            if ($filters['noExperience'] == 'true') {
                $query->where('experience', 'Без опыта работы');
            }
        }

        // Filter by publication time
        if (!empty($filters['publicTime'])) {
            $query->where('created_at', '>=', $filters['publicTime']);
        }

        return $query->paginate(10);
    }

    public function getFeaturedActiveAnnouncement(string $paymentStatus, ?int $excludeId = null): ?Announcement
    {
        return Announcement::query()
            ->recentActive()
            ->select([
                'id',
                'title',
                'description',
                'salary_type',
                'cost',
                'cost_min',
                'cost_max',
                'payment_status',
                'published_at',
            ])
            ->where('payment_status', $paymentStatus)
            ->when($excludeId, fn ($query) => $query->where('id', '!=', $excludeId))
            ->orderByDesc('published_at')
            ->first();
    }

    public function getAllActiveAnnouncementsWithout(int $id, int $specializationId)
    {
        $query = Announcement::query()
            ->active()
            ->select([
                'id',
                'title',
                'city',
                'salary_type',
                'cost',
                'cost_min',
                'cost_max',
                'work_time',
                'published_at',
            ])
            ->orderBy('published_at', 'desc')
            ->where('id', '!=', $id)
            ->where('specialization_id', $specializationId);

        return $query->limit(6)->get();
    }

    public function getAllActiveAnnouncementsByIds(array $ids): LengthAwarePaginator
    {
        return Announcement::query()
            ->active()
            ->orderBy('published_at', 'desc')
            ->with('user')
            ->whereIn('id', $ids)
            ->paginate(10);
    }


    public function getAnnouncementById($id): ?Announcement
    {
        $announcement = Announcement::query()
            ->where('id', $id)
            ->with([
                'user:id,name,description',
                'specialization:id,name_ru,name_kz',
                'address:id,announcement_id,adress',
                'conditions:id,announcement_id,condition',
                'requirements:id,announcement_id,requirement',
                'responsibilities:id,announcement_id,responsibility',
            ])
            ->withCount('responses')
            ->first();

        if ($announcement) {
            $is_favorite                  = Auth::check() && Favorite::where('user_id', Auth::id())->where('announcement_id', $announcement->id)->exists();
            $announcement->is_favorite    = $is_favorite;
        }

        return $announcement;
    }

    public function createAnnouncement(array $data): Announcement
    {
        return Announcement::query()->create($data);
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

    public function existsByIdAndUserId(int $id, int $userId): bool
    {
        return Announcement::query()
            ->where(['id' => $id, 'user_id' => $userId])
            ->exists();
    }
}
