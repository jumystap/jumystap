<?php

namespace Tests\Feature\Console;

use App\Enums\AnnouncementStatus;
use App\Models\Announcement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class RepublishAnnouncementsCommandTest extends TestCase
{
    use RefreshDatabase;

    private int $userId;

    protected function setUp(): void
    {
        parent::setUp();

        // roles-таблица без timestamps
        $roleId = DB::table('roles')->insertGetId([
            'name_kz' => 'Жұмыс беруші',
            'name_ru' => 'Работодатель',
        ]);

        // UserFactory в проекте сломан — создаём пользователя напрямую с обязательными полями
        $this->userId = DB::table('users')->insertGetId([
            'name' => 'Test Employer',
            'role_id' => $roleId,
            'phone' => '+77000000001',
            'email' => 'employer@test.kz',
            'password' => bcrypt('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /** @test */
    public function it_republishes_five_oldest_promoted_active_announcements(): void
    {
        // 6 промо (ACTIVE) с разным «возрастом» updated_at: 10..5 дней назад
        $promo = [];
        foreach ([10, 9, 8, 7, 6, 5] as $i => $days) {
            $promo[$days] = $this->makeAnnouncement([
                'is_top' => $i % 2 === 0,
                'is_urgent' => $i % 2 === 1,
            ], $days);
        }

        // Непромо ACTIVE, старее всех — подниматься не должно
        $nonPromo = $this->makeAnnouncement([], 20);

        // Промо, но не ACTIVE (архив) — подниматься не должно
        $archivedPromo = $this->makeAnnouncement([
            'is_permanent' => true,
            'status' => AnnouncementStatus::ARCHIVED->value,
        ], 30);

        $this->artisan('app:announcements:republish')
            ->expectsOutputToContain('Republished announcements: 5')
            ->assertSuccessful();

        // 5 самых старых промо (10..6 дней) — подняты (updated_at ~ сейчас)
        foreach ([10, 9, 8, 7, 6] as $days) {
            $this->assertTrue(
                Announcement::find($promo[$days]->id)->updated_at->gt(now()->subMinutes(5)),
                "Промо с updated_at {$days}д назад должно было подняться наверх"
            );
        }

        // 6-е промо (самое свежее, 5 дней) — НЕ поднято
        $this->assertTrue(
            Announcement::find($promo[5]->id)->updated_at->lt(now()->subDay()),
            'Самое свежее промо не входит в дневную пятёрку и не должно подниматься'
        );

        // Непромо и архивное промо — не тронуты
        $this->assertTrue(Announcement::find($nonPromo->id)->updated_at->lt(now()->subDay()));
        $this->assertTrue(Announcement::find($archivedPromo->id)->updated_at->lt(now()->subDay()));
    }

    /**
     * Создаёт объявление и выставляет ему «старый» updated_at/published_at
     * в обход авто-таймстампов Eloquent.
     */
    private function makeAnnouncement(array $attributes, int $updatedDaysAgo): Announcement
    {
        $announcement = Announcement::create(array_merge([
            'user_id' => $this->userId,
            'type_kz' => 'Вакансия',
            'type_ru' => 'Вакансия',
            'title' => 'Test',
            'description' => 'Test description',
            'payment_type' => 'Ежемесячная оплата',
            'cost' => 100000,
            'is_top' => false,
            'is_urgent' => false,
            'is_permanent' => false,
            'status' => AnnouncementStatus::ACTIVE->value,
        ], $attributes));

        DB::table('announcements')->where('id', $announcement->id)->update([
            'updated_at' => now()->subDays($updatedDaysAgo),
            'published_at' => now()->subDays($updatedDaysAgo),
        ]);

        return $announcement->refresh();
    }
}
