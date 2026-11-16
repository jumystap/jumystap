<?php

namespace App\Services;

use App\Models\Ad;
use App\Models\AdView;
use App\Repositories\AdRepository;
use App\Repositories\UserRepository;
use Carbon\CarbonInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

class AdService
{
    private const DAILY_CONTACT_LIMIT = 30;

    public function __construct(
        private readonly AdRepository $adRepository,
        private readonly UserRepository $userRepository
    ) {}

    /**
     * Обращение к продавцу: у большинства объявлений номер берётся из профиля автора и виден
     * только через этот вызов, поэтому — те же 30 за скользящие 24 часа, что и у откликов.
     */
    public function contactAd(int $userId, int $adId, array $context): string
    {
        return DB::transaction(function () use ($userId, $adId, $context) {
            // Serialize contacts from this account so parallel requests cannot bypass the limit.
            $this->userRepository->lockUserForUpdate($userId);
            $ad = $this->adRepository->findActiveAdForContact($adId);
            $since = now()->subDay();

            // Повторное обращение к тому же объявлению в пределах окна лишь снова открывает чат.
            if (! $this->adRepository->hasContactSince($userId, $ad->id, $since)) {
                $this->ensureDailyContactLimitNotReached($userId, $since);
                $this->adRepository->createContact($ad, [
                    'user_id' => $userId,
                    'ip_address' => $context['ip_address'] ?? null,
                    'user_agent' => $context['user_agent'] ?? null,
                    'contacted_at' => now(),
                ]);
            }

            $phone = $ad->use_profile_phone ? $ad->user?->phone : $ad->phone;

            return 'https://wa.me/'.$phone.'?text=Здравствуйте!%0A%0AПишу%20с%20Jumystap.%0A%0A';
        });
    }

    private function ensureDailyContactLimitNotReached(int $userId, CarbonInterface $since): void
    {
        if ($this->adRepository->countContactsSince($userId, $since) < self::DAILY_CONTACT_LIMIT) {
            return;
        }

        $availableAt = ($this->adRepository->oldestContactSince($userId, $since) ?? now())->copy()->addDay();

        throw new TooManyRequestsHttpException(
            max(1, (int) ceil(now()->diffInSeconds($availableAt))),
            __('responses.ad_contact_daily_limit', [
                'limit' => self::DAILY_CONTACT_LIMIT,
                'time' => $availableAt->format('H:i'),
            ])
        );
    }

    public function getAllActiveAds(array $filters = null): LengthAwarePaginator
    {
        return $this->adRepository->getAllActiveAds($filters);
    }

    public function getAd($id): Ad
    {
        return $this->adRepository->getAdById($id);
    }

    public function createViews(Ad $ad, array $params): AdView
    {
        return $this->adRepository->createViews($ad, $params);
    }

}

