<?php

namespace App\Services;

use App\Models\PlacementSurvey;
use App\Repositories\PlacementSurveyRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PlacementSurveyService
{
    public function __construct(private PlacementSurveyRepository $placementSurveyRepository) {}

    public function submit(array $data): PlacementSurvey
    {
        return $this->placementSurveyRepository->create($data);
    }

    public function paginateForAdmin(int $perPage = 100): LengthAwarePaginator
    {
        return $this->placementSurveyRepository->paginateForAdmin($perPage);
    }
}
