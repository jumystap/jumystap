<?php

namespace Tests\Unit\Repositories;

use App\Enums\AnnouncementStatus;
use App\Enums\Roles;
use App\Models\Announcement;
use App\Models\User;
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
        Announcement::factory()->create();
        Announcement::factory()->status(AnnouncementStatus::ON_MODERATION)->create();

        $repository = new AnnouncementRepository();

        $activeAnnouncements = $repository->getAllActiveAnnouncements();

        $this->assertCount(1, $activeAnnouncements);
    }

    /** @test */
    public function it_can_get_announcement_by_id()
    {
        $announcement = Announcement::factory()->create();
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
            'user_id' => User::factory()->role(Roles::EMPLOYER)->create()->id,
            'specialization_id' => 1,
            'status' => AnnouncementStatus::ACTIVE->value,
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
        $employee = User::factory()->create();
        Response::query()->create(['employee_id' => $employee->id, 'announcement_id' => $announcement->id]);
        $repository = new AnnouncementRepository();

        $result = $repository->deleteAnnouncement($announcement->id);

        $this->assertTrue($result);
        // Вакансия удаляется мягко, а отклики остаются: иначе удаление освобождало бы суточный лимит.
        $this->assertSoftDeleted('announcements', ['id' => $announcement->id]);
        $this->assertDatabaseHas('responses', ['announcement_id' => $announcement->id]);
    }
}

