<?php

namespace App\Services;

use App\Models\Ad;
use App\Repositories\AdRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class AdService
{
    public function __construct(private readonly AdRepository $adRepository)
    {
    }

    public function getAllActiveAds(array $filters = null): LengthAwarePaginator
    {
        return $this->adRepository->getAllActiveAds($filters);
    }

    public function getAd($id): Ad
    {
        return $this->adRepository->getAdById($id);
    }

}

