<?php

namespace Tests\Unit\Repositories;

use App\Models\Announcement;
use App\Models\Response;
use App\Models\Favorite;
use App\Repositories\AnnouncementRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AnnouncementRepositoryTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_get_all_active_announcements()
    {
        Announcement::factory()->create(['active' => 1]);
        Announcement::factory()->create(['active' => 0]);

        $repository = new AnnouncementRepository();

        $activeAnnouncements = $repository->getAllActiveAnnouncements();

        $this->assertCount(1, $activeAnnouncements);
    }

    /** @test */
    public function it_can_get_announcement_by_id()
    {
        $announcement = Announcement::factory()->create(['active' => 1]);
        $repository = new AnnouncementRepository();

        $retrievedAnnouncement = $repository->getAnnouncementById($announcement->id);

        $this->assertNotNull($retrievedAnnouncement);
        $this->assertEquals($announcement->id, $retrievedAnnouncement->id);
    }

    /** @test */
    public function it_can_create_announcement()
    {
        $data = [
            'title' => 'New Announcement',
            'type_kz' => 'Type in KZ',
            'type_ru' => 'Type in RU',
            'description' => 'This is a test description',
            'payment_type' => 'Fixed',
            'cost' => 100,
            'user_id' => 1,
            'active' => 1,
        ];

        $repository = new AnnouncementRepository();
        $announcement = $repository->createAnnouncement($data);

        $this->assertInstanceOf(Announcement::class, $announcement);
        $this->assertDatabaseHas('announcements', $data);
    }

    /** @test */
    public function it_can_update_announcement()
    {
        $announcement = Announcement::factory()->create();
        $repository = new AnnouncementRepository();

        $data = [
            'title' => 'Updated Title',
            'description' => 'Updated Description',
            'cost' => 200
        ];

        $result = $repository->updateAnnouncement($announcement->id, $data);

        $this->assertTrue($result);
        $this->assertDatabaseHas('announcements', $data);
    }

    /** @test */
    public function it_can_delete_announcement()
    {
        $announcement = Announcement::factory()->create();
        $repository = new AnnouncementRepository();

        $result = $repository->deleteAnnouncement($announcement->id);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('announcements', ['id' => $announcement->id]);
    }
}

