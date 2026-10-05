<?php

namespace App\Repositories;

use App\Models\PlacementSurvey;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\LazyCollection;

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

    public function cursorForExport(): LazyCollection
    {
        return PlacementSurvey::query()
            ->select([
                'id',
                'name',
                'phone',
                'position',
                'found_via_site',
                'is_graduate',
                'consent',
                'created_at',
            ])
            ->latest('id')
            ->cursor();
    }
}
