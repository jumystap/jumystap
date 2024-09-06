<?php

namespace Tests\Unit\Controllers;

use App\Http\Controllers\AnnouncementController;
use App\Models\Announcement;
use App\Services\AnnouncementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Mockery;
use Tests\TestCase;

class AnnouncementControllerTest extends TestCase
{
    /** @test */
    public function it_can_display_all_announcements()
    {
        $service = Mockery::mock(AnnouncementService::class);
        $service->shouldReceive('getAllActiveAnnouncements')->once()->andReturn(collect(['announcement1', 'announcement2']));

        Inertia::shouldReceive('render')->with('Announcements', ['announcements' => ['announcement1', 'announcement2']])->once();

        $controller = new AnnouncementController($service);
        $controller->index();
    }

    /** @test */
    public function it_can_show_an_announcement()
    {
        $service = Mockery::mock(AnnouncementService::class);
        $service->shouldReceive('getAnnouncement')->with(1)->once()->andReturn(new Announcement(['id' => 1]));

        Inertia::shouldReceive('render')->with('Announcement', Mockery::on(function ($data) {
            return isset($data['announcement']);
        }))->once();

        $controller = new AnnouncementController($service);
        $controller->show(1);
    }

    /** @test */
    public function it_can_create_an_announcement()
    {
        $service = Mockery::mock(AnnouncementService::class);
        $request = Request::create('/create', 'POST', [
            'type_kz' => 'Type KZ',
            'type_ru' => 'Type RU',
            'title' => 'Test Title',
            'description' => 'Test Description',
            'payment_type' => 'Fixed',
            'cost' => 100,
            'active' => 1,
        ]);

        Log::shouldReceive('info')->once();
        $service->shouldReceive('createAnnouncement')->once()->andReturn(new Announcement(['id' => 1]));

        $controller = new AnnouncementController($service);
        $response = $controller->create($request);

        $this->assertEquals(302, $response->getStatusCode()); // Check redirect
    }
}

