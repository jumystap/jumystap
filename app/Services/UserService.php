<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\Profession\Profession;
use App\Models\User;
use App\Models\UserProfession;
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
        $validatedData['role_id']  = DB::table('roles')
            ->where('name', $validatedData['role'])
            ->first()
            ->id;

        $user = $this->userRepository->createUser($validatedData);
        $this->getCertificates($user);

        return $user;
    }

    public function getCertificates(User $user): void
    {
        $response     = Http::get(config('services.bitrix.uri') . 'crm.duplicate.findbycomm?type=PHONE&entity_type=CONTACT&values[]=' . $user->phone);
        if ($response->successful()) {
            $data = $response->json();
            if (!empty($data['result']['CONTACT'])) {
                $contactId = $data['result']['CONTACT'][0];
                $this->assignCertificate('work', $contactId, $user);
                $this->assignCertificate('digital', $contactId, $user);
            }
        }
    }

    protected function assignCertificate(string $type, int $contactId, User $user): void
    {
        $professionMap = [
            "Швея"                                     => 1,
            "Модельер-конструктор"                     => 2,
            "Бариста"                                  => 3,
            "Продавец-кассир"                          => 4,
            "Основы изготовления корпусной мебели"     => 5,
            "Ремонт обуви и изготовление ключей"       => 6,
            "Электрогазосварщик"                       => 7,
            "Основы  бухгалтерского учета"             => 8,
            "SMM"                                      => 9,
            "Мобилограф"                               => 10,
            "Таргетолог"                               => 11,
            "Графический дизайнер"                     => 12,
            "Видеомонтаж"                              => 13,
            "Веб-дизайн + Создание и разработка сайта" => 14,
            "Маркетплейс"                              => 15,
            "Базовые цифровые навыки"                  => 16,
        ];

        $baseUri = config('services.bitrix.uri');
        $path    = $type == 'digital' ? "digital_certificates.certificates.list?contact_id={$contactId}" : "working_certificates.certificates.list?contact_id={$contactId}";

        $response = Http::get($baseUri . $path);
        if ($response->successful()) {
            $data = $response->json();
            if (!empty($data['result'])) {
                foreach ($data['result'] as $certificate) {
                    $professionId = $professionMap[$certificate['PROFESSION']['NAME_RU']] ?? null;
                    if (!$professionId) {
                        continue;
                    }
                    $params = [
                        'type'               => $type,
                        'bitrix_id'          => $certificate['ID'],
                        'user_id'            => $user->id,
                        'profession_id'      => $professionId,
                        'certificate_number' => $certificate['NUMBER'],
                        'certificate_link'   => $certificate['LINK'],
                    ];
                    UserProfession::query()
                        ->updateOrCreate(
                            [
                                'user_id'            => $user->id,
                                'profession_id'      => $professionId,
                                'certificate_number' => $certificate['NUMBER'],
                            ],
                            $params
                        );
                    $user->update(['is_graduate' => 1]);
                }
            }
        }
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
        } else {
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
            $img     = Image::make(Storage::disk('public')->path($path))->encode('jpg');
            $newPath = str_replace('.heic', '.jpg', $path);
            Storage::disk('public')->put($newPath, (string)$img);
            Storage::disk('public')->delete($path);
            $path = $newPath;
        }

        $optimizerChain = OptimizerChainFactory::create();
        $optimizerChain->optimize(Storage::disk('public')->path($path));

        return $path;
    }

    public function determineUserStatuses(array $validated): array
    {
        $ip_status      = $validated['ipStatus1'] == 'no' ? "Нет ИП" : "Есть ИП";
        $ip_status_kz   = $validated['ipStatus1'] == 'no' ? "ЖК жоқ" : "ЖК бар";
        $status         = $validated['ipStatus2'] == 'no' ? "Не в активном поиске" : "В активном поиске";
        $status_kz      = $validated['ipStatus2'] == 'no' ? "Жұмыс іздеп жүрген жоқпын" : "Жұмыс іздеп жүрмін";
        $work_status    = $validated['ipStatus3'] == 'no' ? "Ищет заказы" : "Ищет работу";
        $work_status_kz = $validated['ipStatus3'] == 'no' ? "Тапсырыс орындаушы" : "Мен тұрақты жұмыс іздеймін";

        return [
            'ip'             => $ip_status,
            'ip_kz'          => $ip_status_kz,
            'status'         => $status,
            'status_kz'      => $status_kz,
            'work_status'    => $work_status,
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
                'rating'       => $calculated_rating,
                'rating_count' => $user->rating_count + 1,
            ]);

            return $user;
        }

        throw new \Exception("User not found");
    }
}

