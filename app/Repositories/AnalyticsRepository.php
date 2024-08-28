<?php

namespace App\Repositories;

use App\Models\User;
use Carbon\Carbon;

class AnalyticsRepository
{
    public function getTotalUsers(): int
    {
        return User::count();
    }

    public function getUsersCreatedYesterday(): int
    {
        return User::whereDate('created_at', Carbon::yesterday())->count();
    }

    public function getUsersByRole(int $roleId, bool $createdYesterday = false): int
    {
        $query = User::where('role_id', $roleId);

        if ($createdYesterday) {
            $query->whereDate('created_at', Carbon::yesterday());
        }

        return $query->count();
    }

    public function getUsersExcludingRole(int $roleId, bool $createdYesterday = false): int
    {
        $query = User::where('role_id', '!=', $roleId);

        if ($createdYesterday) {
            $query->whereDate('created_at', Carbon::yesterday());
        }

        return $query->count();
    }

    public function getGraduatesCount(int $roleId, bool $isGraduate, $createdYesterday = false): int
    {
        $user = User::where('role_id', $roleId)
                    ->where('is_graduate', $isGraduate);

        if($createdYesterday) {
            $user->whereDate('created_at', Carbon::yesterday());
        }

        return $user->count();
    }

    public function getGraduateAgeCount(int $roleId, bool $isGraduate, string $atribute, $value, string $operator, $createdYesterday = false): int
    {
        $user = User::where('role_id', $roleId)
                    ->where('is_graduate', $isGraduate)
                    ->where($atribute, $operator, $value);

        if($createdYesterday) {
            $user->whereDate('created_at', Carbon::yesterday());
        }

        return $user->count();
    }
}

