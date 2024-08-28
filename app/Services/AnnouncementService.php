<?php

namespace App\Services;

use App\Models\Announcement;
use App\Repositories\AnnouncementRepository;

class AnnouncementService
{
    protected $announcementRepository;

    public function __construct(AnnouncementRepository $announcementRepository)
    {
        $this->announcementRepository = $announcementRepository;
    }

    public function getAnnouncement($id): Announcement
    {
        $announcement = $this->announcementRepository->getAnnouncementById($id);

        return $announcement;
    }

}
