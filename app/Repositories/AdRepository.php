<?php

namespace App\Repositories;

use App\Enums\AdStatus;
use App\Models\Ad;
use App\Models\AdContact;
use App\Models\AdView;
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

        if (!empty($filters['price_from'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('price_exact', '>=', $filters['price_from'])
                  ->orWhere('price_from', '>=', $filters['price_from']);
            });
        }

        if (!empty($filters['price_to'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('price_exact', '<=', $filters['price_to'])
                  ->orWhere('price_to', '<=', $filters['price_to']);
            });
        }

        if (isset($filters['is_joltap']) && $filters['is_joltap']) {
            $query->whereHas('user', function ($q) {
                $q->where('is_graduate', true);
            });
        }

        if (isset($filters['is_negotiable']) && $filters['is_negotiable']) {
            $query->where('price_type', \App\Enums\PriceType::NEGOTIABLE);
        }

        return $query->paginate(10);
    }

    public function getAdById($id): ?Ad
    {
        return Ad::query()->where('id', $id)->with('user.ads', 'user', 'category', 'city', 'photos')->firstOrFail();
    }

    public function createViews(Ad $ad, array $params): ?AdView
    {
        $ad->incrementViews();
        return $ad->views()->create($params);
    }

    public function createContact(Ad $ad, array $params): ?AdContact
    {
        $ad->incrementContactsShown();
        return $ad->contacts()->create($params);
    }

}

