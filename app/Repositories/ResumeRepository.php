<?php

namespace App\Repositories;

use App\Models\UserResume;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ResumeRepository
{
    public function paginateForAdmin(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        $query = UserResume::query()
            ->with('user')
            ->withCount('organizations');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        $search = trim($filters['search'] ?? '');
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('position', 'like', "%{$search}%")
                    ->orWhere('id', $search)
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        return $query->orderByDesc('updated_at')
            ->paginate($perPage)
            ->withQueryString();
    }
}
