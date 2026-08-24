<?php

namespace App\Repositories;

use App\Models\FeedbackApplication;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FeedbackApplicationRepository
{
    public function create(array $data): FeedbackApplication
    {
        return FeedbackApplication::query()->create($data);
    }

    public function paginateForAdmin(int $perPage = 100): LengthAwarePaginator
    {
        return FeedbackApplication::query()
            ->latest('id')
            ->paginate($perPage);
    }
}
