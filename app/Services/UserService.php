<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\Profession\Profession;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
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

    public function getEmployees($filters = [])
{
    return $this->userRepository->getUsersByRoleName('employee', 10, $filters);
}


    public function storeUser(array $validatedData)
    {
        $validatedData['password'] = Hash::make($validatedData['password']);
        $validatedData['role_id'] = DB::table('roles')
            ->where('name', $validatedData['role'])
            ->first()
            ->id;

        $user = $this->userRepository->createUser($validatedData);

        if($this->getCertificates($validatedData, $user)){
            $user->update(['is_graduate' => 1]);
        } else {
            $user->update(['is_graduate' => 0]);
        }

        return $user;
    }

    public function getCertificates(array $validatedData, $user)
    {
        $certificate_numbers = [];
        $profession_ids = [];

        $certificates = DB::table('certificates')
            ->where('phone', $validatedData['phone'])
            ->get();

        if($certificates->isNotEmpty()){
            foreach($certificates as $certificate){
                $certificate_numbers[] = $certificate->certificate_number;
                $profession_ids[] = $certificate->profession_id;
            }

            foreach($profession_ids as $index => $profession_id){
                if (!$this->hasUserProfession($user->id, $certificate_numbers[$index], $profession_id)) {
                    $this->userRepository->addUserProfession(
                        $user->id,
                        $profession_id,
                        $certificate_numbers[$index] ?? null
                    );
                }
            }

            return true;
        }

        $professionMap = [
            "Основы изготовления корпусной мебели" => 5,
            "Ремонт обуви и изготовление ключей" => 6,
            "Основы  бухгалтерского учета" => 8,
            "Модельер-конструктор" => 2,
            "Швея" => 1,
            "Электрогазосварщик" => 7,
            "Бариста" => 3,
            "Продавец-кассир" => 4,
            "Базовые цифровые навыки" => 16,
            "Веб-дизайн + Создание и разработка сайта" => 14,
            "Графический дизайнер" => 12,
            "Мобилограф" => 10,
            "Маркетплейс" => 15,
            "Видеомонтаж" => 13,
            "Таргетолог" => 11,
            "SMM" => 9,
        ];

        $url = 'https://crm.joltap.kz/rest/1/gsjlekv9xqpwgw3q/crm.duplicate.findbycomm?type=PHONE&entity_type=CONTACT&values[]=' . $validatedData['phone'];

        $response = Http::get($url);

        $responseData = $response->json();

        if (isset($responseData['result']['CONTACT']) && !empty($responseData['result']['CONTACT'])) {
            $contact_id = $responseData['result']['CONTACT'][0];

            $workUrl = 'https://crm.joltap.kz/rest/1/gsjlekv9xqpwgw3q/working_certificates.certificates.list?contact_id=' . $contact_id;
            $workResponse = Http::get($workUrl);
            $workData = $workResponse->json();

            if (isset($workData['result']) && !empty($workData['result'])) {
                foreach ($workData['result'] as $certificate) {
                    $certificate_number = $certificate['NUMBER'];
                    $profession_name = $certificate['PROFESSION']['NAME_RU'];
                    $profession_id = $professionMap[$profession_name] ?? null;

                    if ($profession_id && !$this->hasUserProfession($user->id, $certificate_number, $profession_id)) {
                        $this->userRepository->addUserProfession(
                            $user->id,
                            $profession_id,
                            $certificate_number
                        );
                    }
                }

                return true;
            }

            $digitalUrl = 'https://crm.joltap.kz/rest/1/gsjlekv9xqpwgw3q/digital_certificates.certificates.list?contact_id=' . $contact_id;
            $digitalResponse = Http::get($digitalUrl);
            $digitalData = $digitalResponse->json();

            if (isset($digitalData['result']) && !empty($digitalData['result'])) {
                foreach ($digitalData['result'] as $certificate) {
                    $certificate_number = $certificate['NUMBER'];
                    $profession_name = $certificate['PROFESSION']['NAME_RU'];
                    $profession_id = $professionMap[$profession_name] ?? null;

                    if ($profession_id && !$this->hasUserProfession($user->id, $certificate_number, $profession_id)) {
                        $this->userRepository->addUserProfession(
                            $user->id,
                            $profession_id,
                            $certificate_number
                        );
                    }
                }

                return true;
            }
        } else {
            $contact_id = null;
            return false;
        }

        return false;
    }

    /**
     * Check if the user already has the profession with the given certificate.
     *
     * @param int $user_id
     * @param string $certificate_number
     * @param int $profession_id
     * @return bool
     */
    protected function hasUserProfession($user_id, $certificate_number, $profession_id)
    {
        return DB::table('user_professions')
            ->where('user_id', $user_id)
            ->where('certificate_number', $certificate_number)
            ->where('profession_id', $profession_id)
            ->exists();
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
        }else{
            unset($validatedData['password']);
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

