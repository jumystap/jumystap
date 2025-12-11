<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserRepository
{
    public function getUsersByRoleName($roleName, $perPage, $filters = [])
    {
        $query = User::whereHas('role', function ($query) use ($roleName) {
            $query->where('name', $roleName);
        })->with('role');

        // Apply filters
        if (!empty($filters['search'])) {
            $search = $filters['search'];

            // 🔥 быстрый поиск профессий
            $professionIdsBySearch = DB::table('professions')
                ->where('name_ru', 'like', "%$search%")
                ->orWhere('name_kz', 'like', "%$search%")
                ->pluck('id');

            $query->where(function($q) use ($search, $professionIdsBySearch) {

                // поиск в users
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");

                // поиск в resumes
                $q->orWhereHas('resumes', function($r) use ($search) {
                    $r->where('position', 'like', "%$search%")
                        ->orWhere('about', 'like', "%$search%");
                });

                // 🔥 быстрый поиск в professions через pivot
                if ($professionIdsBySearch->isNotEmpty()) {
                    $q->orWhereIn('id', function ($sub) use ($professionIdsBySearch) {
                        $sub->select('user_id')
                            ->from('user_professions')
                            ->whereIn('profession_id', $professionIdsBySearch);
                    });
                }

            });
        }


        if (!empty($filters['profession'])) {

            // Достаём всех пользователей по профессии через pivot (максимально быстро)
            $userIds = DB::table('user_professions')
                ->where('profession_id', $filters['profession'])
                ->pluck('user_id');

            // Если ничего не найдено - сразу возвращаем пустой результат
            if ($userIds->isEmpty()) {
                return collect([]); // или empty paginator - как тебе нужно
            }

            // Фильтруем по id
            $query->whereIn('id', $userIds);
        }

        if (!empty($filters['isLookingWork']) && $filters['isLookingWork'] == 'true') {
            $query->where('status', 'В активном поиске');
        }

        if (!empty($filters['withCertificate']) && $filters['withCertificate'] == 'true') {
            $query->where('is_graduate', true);
        }

        if (!empty($filters['withResume']) && $filters['withResume'] == 'true') {
            $query->whereHas('resumes');
        }

        $users = $query->paginate($perPage)->withQueryString();

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
            ->select('professions.id as profession_id', 'professions.name_ru as profession_name', 'professions.name_kz as profession_name_kz', 'user_professions.certificate_number', 'user_professions.certificate_link')
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
            'user_id'            => $userId,
            'profession_id'      => $professionId,
            'certificate_number' => $certificateNumber,
        ]);
    }

    public function findUserById($id)
    {
        return User::with(['profession', 'portfolio'])->findOrFail($id);
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

