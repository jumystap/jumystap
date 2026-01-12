<?php

namespace App\Repositories;

use App\Enums\AdStatus;
use App\Models\Ad;
use Illuminate\Pagination\LengthAwarePaginator;

class AdRepository
{
    public function getAllActiveAds(array $filters = null): LengthAwarePaginator
    {
        $query = Ad::query()->orderBy('published_at', 'desc')
            ->with('user', 'category', 'city')
            ->where("status", AdStatus::ACTIVE);

        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];

            $query->where(function ($query) use ($keyword) {
                $query->where('title', 'LIKE', "%{$keyword}%")
                    ->orWhere('description', 'LIKE', "%{$keyword}%");
            });
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }
        if (!empty($filters['city_id'])) {
            $query->where('city_id', $filters['city_id']);
        }

        return $query->paginate(10);
    }

    public function getAdById($id): ?Ad
    {
        return Ad::query()->where('id', $id)->with('user.ads', 'user', 'category', 'city', 'photos')->firstOrFail();
    }

}

