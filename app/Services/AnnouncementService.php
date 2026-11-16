<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\UserResume;
use App\Repositories\AnnouncementRepository;
use App\Repositories\ResumeRepository;
use App\Repositories\UserRepository;
use Carbon\CarbonInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

class AnnouncementService
{
    private const DAILY_RESPONSE_LIMIT = 30;

    protected $announcementRepository;

    protected $userRepository;

    protected $resumeRepository;

    public function __construct(
        AnnouncementRepository $announcementRepository,
        UserRepository $userRepository,
        ResumeRepository $resumeRepository
    ) {
        $this->announcementRepository = $announcementRepository;
        $this->userRepository = $userRepository;
        $this->resumeRepository = $resumeRepository;
    }

    public function getAllActiveAnnouncements(?array $filters = null)
    {
        return $this->announcementRepository->getAllActiveAnnouncements($filters);
    }

    public function suggestAnnouncements(string $keyword, int $limit = 8): array
    {
        return $this->announcementRepository->suggestAnnouncements($keyword, $limit);
    }

    public function getAllActiveAnnouncementsWithout(int $id, int $specializationId)
    {
        return $this->announcementRepository->getAllActiveAnnouncementsWithout($id, $specializationId);
    }

    public function getFeaturedActiveAnnouncement(string $paymentStatus, ?int $excludeId = null): ?Announcement
    {
        return $this->announcementRepository->getFeaturedActiveAnnouncement($paymentStatus, $excludeId);
    }

    public function getAllActiveAnnouncementsByIds(array $ids): LengthAwarePaginator
    {
        return $this->announcementRepository->getAllActiveAnnouncementsByIds($ids);
    }

    public function getAnnouncement($id): ?Announcement
    {
        return $this->announcementRepository->getAnnouncementById($id);
    }

    public function createAnnouncement(array $data): Announcement
    {
        return $this->announcementRepository->createAnnouncement($data);
    }

    public function respondToAnnouncement(int $employeeId, int $announcementId): string
    {
        return DB::transaction(function () use ($employeeId, $announcementId) {
            // Serialize responses from this account so parallel requests cannot bypass the limit.
            $this->userRepository->lockUserForUpdate($employeeId);
            $announcement = $this->announcementRepository->getActiveAnnouncementForResponse($announcementId);
            $since = now()->subDay();

            // Повторный переход по той же вакансии в пределах окна просто снова открывает чат:
            // номер уже был показан, поэтому новый отклик не пишется и лимит не расходуется.
            if (! $this->announcementRepository->hasResponseSince($employeeId, $announcement->id, $since)) {
                $this->ensureDailyLimitNotReached($employeeId, $since);
                $this->announcementRepository->createResponse($employeeId, $announcement->id);
            }

            $resume = $this->resumeRepository->findLatestActiveForUser($employeeId);

            return $this->buildResponseUrl($announcement, $resume);
        });
    }

    private function ensureDailyLimitNotReached(int $employeeId, CarbonInterface $since): void
    {
        if ($this->announcementRepository->countResponsesSince($employeeId, $since) < self::DAILY_RESPONSE_LIMIT) {
            return;
        }

        // Окно скользящее: слот освобождается, когда самому старому отклику в окне исполнится 24 часа.
        $availableAt = ($this->announcementRepository->oldestResponseSince($employeeId, $since) ?? now())->copy()->addDay();

        throw new TooManyRequestsHttpException(
            max(1, (int) ceil(now()->diffInSeconds($availableAt))),
            __('responses.daily_limit', [
                'limit' => self::DAILY_RESPONSE_LIMIT,
                'time' => $availableAt->format('H:i'),
            ])
        );
    }

    private function buildResponseUrl(Announcement $announcement, ?UserResume $resume): string
    {
        $phone = preg_replace('/\D+/', '', (string) ($announcement->phone ?? $announcement->user?->phone));
        $text = "Здравствуйте! Откликаюсь на позицию «{$announcement->title}».";

        if ($resume) {
            // The signed link lets the employer view the candidate's published resume and contacts.
            $text .= "\nМоё резюме: ".URL::temporarySignedRoute(
                'resumes.show',
                now()->addDays(30),
                ['id' => $resume->id]
            );
        }

        $text .= "\n\nПишу с Jumystap.";

        return "https://wa.me/{$phone}?text=".rawurlencode($text);
    }

    public function updateAnnouncement($id, array $data): bool
    {
        return $this->announcementRepository->updateAnnouncement($id, $data);
    }

    public function republishPromotedAnnouncements(int $limit = 5): int
    {
        return $this->announcementRepository->republishOldestPromoted($limit);
    }

    public function deleteAnnouncement($id): bool
    {
        return $this->announcementRepository->deleteAnnouncement($id);
    }
}
