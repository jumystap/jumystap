<?php

namespace App\Services;

use App\Models\Ad;
use App\Models\AdContact;
use App\Models\AdView;
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

    public function createViews(Ad $ad, array $params): AdView
    {
        return $this->adRepository->createViews($ad, $params);
    }

    public function createContact(Ad $ad, array $params): AdContact
    {
        return $this->adRepository->createContact($ad, $params);
    }

}

