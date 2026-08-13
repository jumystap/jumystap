<?php

use App\Enums\ResumeStatus;
use App\Enums\Roles;
use App\Models\User;
use App\Models\UserResume;
use App\Repositories\UserRepository;
use App\Services\ResumeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('approve publishes the resume and records history', function () {
    $resume  = createUserResume(['status' => ResumeStatus::MODERATION]);
    $service = app(ResumeService::class);

    $service->approve($resume);

    $resume->refresh();

    expect($resume->status)->toBe(ResumeStatus::ACTIVE)
        ->and($resume->published_at)->not->toBeNull();

    $this->assertDatabaseHas('resume_status_histories', [
        'user_resume_id' => $resume->id,
        'status_from'    => 'moderation',
        'status_to'      => 'active',
    ]);
});

test('reject stores the reason and records history', function () {
    $resume  = createUserResume(['status' => ResumeStatus::MODERATION]);
    $service = app(ResumeService::class);

    $service->reject($resume, 'Spam');

    $resume->refresh();

    expect($resume->status)->toBe(ResumeStatus::REJECTED)
        ->and($resume->reject_reason)->toBe('Spam');

    $this->assertDatabaseHas('resume_status_histories', [
        'user_resume_id' => $resume->id,
        'status_to'      => 'rejected',
        'comment'        => 'Spam',
    ]);
});

test('returnToModeration is a no-op when the resume is already on moderation', function () {
    $resume  = createUserResume(['status' => ResumeStatus::MODERATION]);
    $service = app(ResumeService::class);

    $service->returnToModeration($resume);

    expect($resume->refresh()->status)->toBe(ResumeStatus::MODERATION)
        ->and($resume->statusHistory()->count())->toBe(0);
});

test('returnToModeration clears the reject reason', function () {
    $resume  = createUserResume(['status' => ResumeStatus::REJECTED, 'reject_reason' => 'old']);
    $service = app(ResumeService::class);

    $service->returnToModeration($resume);

    $resume->refresh();

    expect($resume->status)->toBe(ResumeStatus::MODERATION)
        ->and($resume->reject_reason)->toBeNull();
});

test('moderation notification goes to the configured chat when env is set', function () {
    config()->set('services.telegram.resume_moderation_chat_id', '-100500');
    \DefStudio\Telegraph\Models\TelegraphBot::create(['token' => 'fake-token', 'name' => 'test-bot']);
    \DefStudio\Telegraph\Facades\Telegraph::fake();

    // telegram_admins пуста: без конфига уведомление не ушло бы вовсе,
    // так что факт отправки доказывает маршрутизацию через конфиг.
    $resume = createUserResume(['status' => ResumeStatus::MODERATION]);
    app(ResumeService::class)->submitForModeration($resume);

    \DefStudio\Telegraph\Facades\Telegraph::assertSent('Новое резюме ожидает одобрения', exact: false);
});

test('active scope only returns published resumes', function () {
    createUserResume(['status' => ResumeStatus::ACTIVE]);
    createUserResume(['status' => ResumeStatus::MODERATION]);
    createUserResume(['status' => ResumeStatus::REJECTED]);

    expect(UserResume::active()->count())->toBe(1);
});

test('employee search excludes users whose only resume is not active', function () {
    $activeUser = makeUser(Roles::EMPLOYEE->value);
    createUserResume(['user' => $activeUser, 'position' => 'Zephyr Cook', 'status' => ResumeStatus::ACTIVE]);

    $modUser = makeUser(Roles::EMPLOYEE->value);
    createUserResume(['user' => $modUser, 'position' => 'Zephyr Cook', 'status' => ResumeStatus::MODERATION]);

    $repo   = app(UserRepository::class);
    $result = $repo->getUsersByRoleName('employee', 10, ['search' => 'Zephyr Cook']);
    $ids    = $result->getCollection()->pluck('id')->all();

    expect($ids)->toContain($activeUser->id)
        ->and($ids)->not->toContain($modUser->id);
});
