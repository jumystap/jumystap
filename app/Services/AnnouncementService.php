<?php

namespace App\Services;

use App\Models\Announcement;
use App\Repositories\AnnouncementRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AnnouncementService
{
    protected $announcementRepository;

    public function __construct(AnnouncementRepository $announcementRepository)
    {
        $this->announcementRepository = $announcementRepository;
    }

    public function getAllActiveAnnouncements(array $filters = null)
    {
        return $this->announcementRepository->getAllActiveAnnouncements($filters);
    }

    public function getAllActiveAnnouncementsWithout(int $id)
    {
        return $this->announcementRepository->getAllActiveAnnouncementsWithout($id);
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

    public function updateAnnouncement($id, array $data): bool
    {
        return $this->announcementRepository->updateAnnouncement($id, $data);
    }

    public function deleteAnnouncement($id): bool
    {
        return $this->announcementRepository->deleteAnnouncement($id);
    }
}

