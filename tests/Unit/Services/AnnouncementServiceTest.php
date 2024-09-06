<?php

namespace Tests\Unit\Services;

use App\Models\Announcement;
use App\Repositories\AnnouncementRepository;
use App\Services\AnnouncementService;
use Mockery;
use Tests\TestCase;

class AnnouncementServiceTest extends TestCase
{
    /** @test */
    public function it_can_get_all_active_announcements()
    {
        $repository = Mockery::mock(AnnouncementRepository::class);
        $repository->shouldReceive('getAllActiveAnnouncements')->once()->andReturn(collect(['announcement1', 'announcement2']));

        $service = new AnnouncementService($repository);
        $announcements = $service->getAllActiveAnnouncements();

        $this->assertCount(2, $announcements);
    }

    /** @test */
    public function it_can_get_announcement_by_id()
    {
        $repository = Mockery::mock(AnnouncementRepository::class);
        $repository->shouldReceive('getAnnouncementById')->with(1)->once()->andReturn(new Announcement(['id' => 1]));

        $service = new AnnouncementService($repository);
        $announcement = $service->getAnnouncement(1);

        $this->assertInstanceOf(Announcement::class, $announcement);
        $this->assertEquals(1, $announcement->id);
    }

    /** @test */
    public function it_can_create_announcement()
    {
        $data = [
            'title' => 'Test Announcement',
            'type_kz' => 'Type KZ',
            'type_ru' => 'Type RU',
            'description' => 'Test description',
            'payment_type' => 'Fixed',
            'cost' => 100,
            'user_id' => 1,
            'active' => 1
        ];

        $repository = Mockery::mock(AnnouncementRepository::class);
        $repository->shouldReceive('createAnnouncement')->with($data)->once()->andReturn(new Announcement($data));

        $service = new AnnouncementService($repository);
        $announcement = $service->createAnnouncement($data);

        $this->assertInstanceOf(Announcement::class, $announcement);
        $this->assertEquals('Test Announcement', $announcement->title);
    }

    /** @test */
    public function it_can_update_announcement()
    {
        $data = [
            'title' => 'Updated Title',
            'description' => 'Updated Description',
            'cost' => 200
        ];

        $repository = Mockery::mock(AnnouncementRepository::class);
        $repository->shouldReceive('updateAnnouncement')->with(1, $data)->once()->andReturn(true);

        $service = new AnnouncementService($repository);
        $result = $service->updateAnnouncement(1, $data);

        $this->assertTrue($result);
    }

    /** @test */
    public function it_can_delete_announcement()
    {
        $repository = Mockery::mock(AnnouncementRepository::class);
        $repository->shouldReceive('deleteAnnouncement')->with(1)->once()->andReturn(true);

        $service = new AnnouncementService($repository);
        $result = $service->deleteAnnouncement(1);

        $this->assertTrue($result);
    }
}

