<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\Profession\Profession;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;
use Spatie\ImageOptimizer\OptimizerChainFactory;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getEmployees()
    {
        return $this->userRepository->getUsersByRoleName('employee', 20);
    }

    public function storeUser(array $validatedData)
    {
        $validatedData['password'] = Hash::make($validatedData['password']);
        $validatedData['role_id'] = DB::table('roles')
            ->where('name', $validatedData['role'])
            ->first()
            ->id;

        $user = $this->userRepository->createUser($validatedData);

        if (isset($validatedData['professions_ids']) && isset($validatedData['certificate_numbers'])) {
            foreach ($validatedData['professions_ids'] as $index => $profession_id) {
                $this->userRepository->addUserProfession(
                    $user->id,
                    $profession_id,
                    $validatedData['certificate_numbers'][$index] ?? null
                );
            }
        }

        return $user;
    }

    public function updateUser($user, array $validatedData)
    {
        if (isset($validatedData['avatar'])) {
            if ($user->image_url) {
                Storage::disk('public')->delete($user->image_url);
            }
            $validatedData['image_url'] = $this->storeAvatar($validatedData['avatar']);
        }

        if (!empty($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        $this->userRepository->updateUser($user, $validatedData);

        if (isset($validatedData['professions_ids']) && isset($validatedData['certificate_numbers'])) {
            $this->userRepository->deleteUserProfessions($user->id);
            foreach ($validatedData['professions_ids'] as $index => $profession_id) {
                $this->userRepository->addUserProfession(
                    $user->id,
                    $profession_id,
                    $validatedData['certificate_numbers'][$index] ?? null
                );
            }
        }

        return $user;
    }

    protected function storeAvatar($file)
    {
        if (!$file) {
            return 'avatars/default.png';
        }

        $path = $file->store('avatars', 'public');
        if ($file->getClientOriginalExtension() === 'heic') {
            $img = Image::make(Storage::disk('public')->path($path))->encode('jpg');
            $newPath = str_replace('.heic', '.jpg', $path);
            Storage::disk('public')->put($newPath, (string) $img);
            Storage::disk('public')->delete($path);
            $path = $newPath;
        }

        $optimizerChain = OptimizerChainFactory::create();
        $optimizerChain->optimize(Storage::disk('public')->path($path));

        return $path;
    }

    public function determineUserStatuses(array $validated): array
    {
        $ip_status = $validated['ipStatus1'] == 'no' ? "Нет ИП" : "Есть ИП";
        $ip_status_kz = $validated['ipStatus1'] == 'no' ? "ЖК жоқ" : "ЖК бар";
        $status = $validated['ipStatus2'] == 'no' ? "Не в активном поиске" : "В активном поиске";
        $status_kz = $validated['ipStatus2'] == 'no' ? "Жұмыс іздеп жүрген жоқпын" : "Жұмыс іздеп жүрмін";
        $work_status = $validated['ipStatus3'] == 'no' ? "Ищет заказы" : "Ищет работу";
        $work_status_kz = $validated['ipStatus3'] == 'no' ? "Тапсырыс орындаушы" : "Мен тұрақты жұмыс іздеймін";

        return [
            'ip' => $ip_status,
            'ip_kz' => $ip_status_kz,
            'status' => $status,
            'status_kz' => $status_kz,
            'work_status' => $work_status,
            'work_status_kz' => $work_status_kz,
        ];
    }

    public function getAllProfessions()
    {
        return Profession::all();
    }

    public function getUserWithProfessionsAndPortfolio($userId)
    {
        return $this->userRepository->findUserById($userId);
    }

    public function getUserProfessions($userId)
    {
        return $this->userRepository->getUserWithProfessions($userId);
    }

    public function getUserProfessionIds($userId)
    {
        return $this->userRepository->getUserProfessionIds($userId);
    }

    public function getUsersByProfessionIds($professionIds)
    {
        return $this->userRepository->findUsersByProfessionIds($professionIds);
    }

    public function getLatestAnnouncements($limit = 6)
    {
        return Announcement::take($limit)->get();
    }

    public function rateUser($userId, $rating)
    {
        $user = $this->userRepository->findUserById($userId);

        if ($user) {
            $calculated_rating = ($user->rating + $rating) / ($user->rating_count + 1);

            $this->userRepository->updateUser($user, [
                'rating' => $calculated_rating,
                'rating_count' => $user->rating_count + 1,
            ]);

            return $user;
        }

        throw new \Exception("User not found");
    }
}

