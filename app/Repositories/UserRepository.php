<?php

namespace App\Repositories;

use App\Enums\Roles;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserRepository
{
    public function getUsersByRoleName($roleName, $perPage, $filters = [])
    {
        $roleId = $this->getRoleId($roleName);

        if (!$roleId) {
            return User::query()->whereRaw('1 = 0')->paginate($perPage)->withQueryString();
        }

        $query = User::query()
            ->select('users.*')
            ->where('users.role_id', $roleId);

        $search = trim($filters['search'] ?? '');
        if ($search !== '') {
            $like = '%' . $this->escapeLike($search) . '%';

            $query->where(function ($q) use ($like) {
                $q->where('users.name', 'like', $like)
                    ->orWhere('users.email', 'like', $like)
                    ->orWhereExists(function ($sub) use ($like) {
                        $sub->selectRaw('1')
                            ->from('user_resumes')
                            ->whereColumn('user_resumes.user_id', 'users.id')
                            ->where(function ($resumeQuery) use ($like) {
                                $resumeQuery->where('user_resumes.position', 'like', $like)
                                    ->orWhere('user_resumes.about', 'like', $like);
                            });
                    })
                    ->orWhereExists(function ($sub) use ($like) {
                        $sub->selectRaw('1')
                            ->from('user_professions')
                            ->join('professions', 'professions.id', '=', 'user_professions.profession_id')
                            ->whereColumn('user_professions.user_id', 'users.id')
                            ->where(function ($professionQuery) use ($like) {
                                $professionQuery->where('professions.name_ru', 'like', $like)
                                    ->orWhere('professions.name_kz', 'like', $like);
                            });
                    });
            });
        }

        if (!empty($filters['profession'])) {
            $query->whereExists(function ($sub) use ($filters) {
                $sub->selectRaw('1')
                    ->from('user_professions')
                    ->whereColumn('user_professions.user_id', 'users.id')
                    ->where('user_professions.profession_id', $filters['profession']);
            });
        }

        if (!empty($filters['isLookingWork']) && $filters['isLookingWork'] == 'true') {
            $query->where('users.status', 'В активном поиске');
        }

        if (!empty($filters['withCertificate']) && $filters['withCertificate'] == 'true') {
            $query->where('users.is_graduate', true);
        }

        if (!empty($filters['withResume']) && $filters['withResume'] == 'true') {
            $query->whereExists(function ($sub) {
                $sub->selectRaw('1')
                    ->from('user_resumes')
                    ->whereColumn('user_resumes.user_id', 'users.id');
            });
        }

        $latestResumeDate = DB::table('user_resumes')
            ->selectRaw('COALESCE(MAX(updated_at), MAX(created_at))')
            ->whereColumn('user_resumes.user_id', 'users.id');

        $query->selectSub($latestResumeDate, 'latest_resume_date')
            ->orderByDesc('latest_resume_date')
            ->orderByDesc('users.id');

        $users = $query->paginate($perPage)->withQueryString();

        $professionsByUser = $this->getProfessionsForUsers($users->getCollection()->pluck('id'));
        $resumesByUser = $this->getResumesForUsers($users->getCollection()->pluck('id'));
        $users->getCollection()->transform(function ($user) use ($professionsByUser, $resumesByUser) {
            $user->professions = $professionsByUser->get($user->id, collect())->values();
            $user->resume_position = $resumesByUser->get($user->id);
            $user->has_resume = $resumesByUser->has($user->id);
            $user->makeHidden(['email', 'phone']);
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

    private function getRoleId(string $roleName): ?int
    {
        return match ($roleName) {
            'employee' => Roles::EMPLOYEE->value,
            'employer' => Roles::EMPLOYER->value,
            'company' => Roles::COMPANY->value,
            default => DB::table('roles')->where('name', $roleName)->value('id'),
        };
    }

    private function escapeLike(string $value): string
    {
        return addcslashes($value, '\%_');
    }

    private function getProfessionsForUsers($userIds)
    {
        if ($userIds->isEmpty()) {
            return collect();
        }

        return DB::table('user_professions')
            ->join('professions', 'user_professions.profession_id', '=', 'professions.id')
            ->select(
                'user_professions.user_id',
                'professions.id as profession_id',
                'professions.name_ru as profession_name',
                'professions.name_kz as profession_name_kz',
                'user_professions.certificate_number',
                'user_professions.certificate_link'
            )
            ->whereIn('user_professions.user_id', $userIds)
            ->orderBy('professions.name_ru')
            ->get()
            ->groupBy('user_id');
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
                $user->makeHidden(['email', 'phone']);
                return $user;
            });
    }

    private function getResumesForUsers($userIds)
    {
        if ($userIds->isEmpty()) {
            return collect();
        }

        return DB::table('user_resumes')
            ->select('user_id', 'position')
            ->whereIn('user_id', $userIds)
            ->orderByDesc('updated_at')
            ->get()
            ->unique('user_id')
            ->pluck('position', 'user_id');
    }
}
