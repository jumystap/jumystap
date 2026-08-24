<?php

use App\Models\FeedbackApplication;
use DefStudio\Telegraph\Facades\Telegraph;
use DefStudio\Telegraph\Models\TelegraphBot;

test('feedback application is saved before it is sent to telegram', function () {
    config()->set('services.telegram.feedback_chat_id', '-100500');
    TelegraphBot::query()->create([
        'token' => 'fake-token',
        'name' => 'test-bot',
    ]);
    Telegraph::fake();

    $response = $this->postJson('/feedback-applications', [
        'name' => '  <b>Алия</b>  ',
        'phone' => '  +7 700 123 45 67  ',
        'skills' => 'PHP & Laravel',
    ]);

    $response
        ->assertCreated()
        ->assertJson([
            'message' => 'Application submitted successfully',
        ]);

    $this->assertDatabaseHas('feedback_applications', [
        'name' => '<b>Алия</b>',
        'phone' => '+7 700 123 45 67',
        'skills' => 'PHP & Laravel',
    ]);

    Telegraph::assertSent('Заявка', exact: false);
    Telegraph::assertSent('&lt;b&gt;Алия&lt;/b&gt;', exact: false);
    Telegraph::assertSent('PHP &amp; Laravel', exact: false);
});

test('feedback application validates required fields and database column lengths', function () {
    $response = $this->postJson('/feedback-applications', [
        'name' => str_repeat('a', 256),
        'phone' => str_repeat('1', 51),
        'skills' => str_repeat('s', 501),
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'phone', 'skills']);

    expect(FeedbackApplication::query()->count())->toBe(0);

    $this->postJson('/feedback-applications', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'phone', 'skills']);
});

test('feedback application remains saved when telegram chat is not configured', function () {
    config()->set('services.telegram.feedback_chat_id');

    $this->postJson('/feedback-applications', [
        'name' => 'Алия',
        'phone' => '+7 700 123 45 67',
        'skills' => 'Бариста',
    ])->assertCreated();

    $this->assertDatabaseHas('feedback_applications', [
        'name' => 'Алия',
        'phone' => '+7 700 123 45 67',
        'skills' => 'Бариста',
    ]);
});

test('feedback application remains saved when telegram throws an exception', function () {
    config()->set('services.telegram.feedback_chat_id', '-100500');
    Telegraph::shouldReceive('chat')
        ->once()
        ->andThrow(new \RuntimeException('Telegram is unavailable'));

    $this->postJson('/feedback-applications', [
        'name' => 'Алия',
        'phone' => '+7 700 123 45 67',
        'skills' => 'Бариста',
    ])->assertCreated();

    $this->assertDatabaseHas('feedback_applications', [
        'name' => 'Алия',
        'phone' => '+7 700 123 45 67',
        'skills' => 'Бариста',
    ]);
});

test('legacy application endpoint also saves the application', function () {
    config()->set('services.telegram.feedback_chat_id', '-100500');
    TelegraphBot::query()->create([
        'token' => 'fake-token',
        'name' => 'test-bot',
    ]);
    Telegraph::fake();

    $this->postJson('/send-telegram-feedback', [
        'type' => 'application',
        'name' => 'Алия',
        'phone' => '+7 700 123 45 67',
        'items' => ['Бариста', 'Пекарь'],
    ])
        ->assertOk()
        ->assertJson([
            'message' => 'Sent successfully',
        ]);

    $this->assertDatabaseHas('feedback_applications', [
        'name' => 'Алия',
        'phone' => '+7 700 123 45 67',
        'skills' => 'Бариста, Пекарь',
    ]);

    Telegraph::assertSent('Заявка', exact: false);
});

test('legacy application endpoint validates the joined skills length', function () {
    $this->postJson('/send-telegram-feedback', [
        'type' => 'application',
        'name' => 'Алия',
        'phone' => '+7 700 123 45 67',
        'items' => [str_repeat('a', 250), str_repeat('b', 249)],
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('items');

    expect(FeedbackApplication::query()->count())->toBe(0);
});

test('legacy application endpoint rejects empty and nested skill items', function () {
    $this->postJson('/send-telegram-feedback', [
        'type' => 'application',
        'name' => 'Алия',
        'phone' => '+7 700 123 45 67',
        'items' => [''],
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('items.0');

    $this->postJson('/send-telegram-feedback', [
        'type' => 'application',
        'name' => 'Алия',
        'phone' => '+7 700 123 45 67',
        'items' => [['nested']],
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('items.0');

    expect(FeedbackApplication::query()->count())->toBe(0);
});

test('complaint endpoint does not create a feedback application', function () {
    config()->set('services.telegram.feedback_chat_id', '-100500');
    TelegraphBot::query()->create([
        'token' => 'fake-token',
        'name' => 'test-bot',
    ]);
    Telegraph::fake();

    $this->postJson('/send-telegram-feedback', [
        'type' => 'complaint',
        'name' => 'Алия',
        'phone' => '+7 700 123 45 67',
        'items' => ['Мошенники'],
        'reason' => 'Описание жалобы',
    ])->assertOk();

    expect(FeedbackApplication::query()->count())->toBe(0);
    Telegraph::assertSent('Жалоба', exact: false);
});
