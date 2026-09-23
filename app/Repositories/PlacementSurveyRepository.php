<?php

namespace App\Repositories;

use App\Models\PlacementSurvey;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PlacementSurveyRepository
{
    public function create(array $data): PlacementSurvey
    {
        return PlacementSurvey::query()->create($data);
    }

    public function paginateForAdmin(int $perPage = 100): LengthAwarePaginator
    {
        return PlacementSurvey::query()
            ->latest('id')
            ->paginate($perPage);
    }
}
