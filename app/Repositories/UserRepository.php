<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserRepository
{
    public function getUsersByRoleName($roleName, $perPage)
    {
        $users = User::whereHas('role', function($query) use ($roleName) {
            $query->where('name', $roleName);
        })
        ->with('role')
        ->paginate($perPage);

        $users->transform(function ($user) {
            $user->professions = $this->getUserWithProfessions($user->id);
            return $user;
        });

        return $users;
    }

    public function getUserWithProfessions($userId)
    {
        return DB::table('user_professions')
            ->join('professions', 'user_professions.profession_id', '=', 'professions.id')
            ->select('professions.id as profession_id', 'professions.name_ru as profession_name', 'professions.name_kz as profession_name_kz', 'user_professions.certificate_number')
            ->where('user_professions.user_id', $userId)
            ->get();
    }

    public function getUserProfessionIds($userId)
    {
        return DB::table('user_professions')
            ->where('user_id', $userId)
            ->pluck('profession_id');
    }

    public function createUser(array $data)
    {
        return User::create($data);
    }

    public function updateUser(User $user, array $data)
    {
        return $user->update($data);
    }

    public function deleteUserProfessions($userId)
    {
        return DB::table('user_professions')->where('user_id', $userId)->delete();
    }

    public function addUserProfession($userId, $professionId, $certificateNumber)
    {
        return DB::table('user_professions')->insert([
            'user_id' => $userId,
            'profession_id' => $professionId,
            'certificate_number' => $certificateNumber,
        ]);
    }

    public function findUserById($id)
    {
        return User::with(['profession', 'portfolio'])->find($id);
    }

    public function findUsersByProfessionIds($professionIds, $limit = 6)
    {
        return User::whereIn('id', function ($query) use ($professionIds) {
            $query->select('user_id')
                ->from('user_professions')
                ->whereIn('profession_id', $professionIds);
        })
        ->take($limit)
        ->get()
        ->map(function ($user) {
            $user->professions = DB::table('user_professions')
                ->join('professions', 'user_professions.profession_id', '=', 'professions.id')
                ->select('professions.name_ru as profession_name', 'professions.name_kz as professions_name_kz', 'user_professions.certificate_number')
                ->where('user_professions.user_id', $user->id)
                ->get();
            return $user;
        });
    }
}

