<?php

use App\Enums\AdStatus;
use App\Enums\AdType;
use App\Enums\PriceType;
use App\Enums\Roles;
use App\Models\Ad;
use App\Models\AdContact;
use Illuminate\Support\Facades\DB;

function makeAd(int $userId, array $attributes = []): Ad
{
    $categoryId = DB::table('ad_categories')->insertGetId([
        'name_ru' => 'Услуги', 'name_kz' => 'Қызметтер', 'slug' => 'uslugi-'.uniqid(),
        'sort_order' => 0, 'is_active' => 1,
    ]);

    return Ad::forceCreate(array_merge([
        'user_id' => $userId,
        'type' => AdType::SERVICE->value,
        'title' => 'Ремонт обуви',
        'description' => 'описание',
        'category_id' => $categoryId,
        'is_remote' => false,
        'price_type' => PriceType::NEGOTIABLE->value,
        'use_profile_phone' => false,
        'phone' => '77011112233',
        'status' => AdStatus::ACTIVE->value,
    ], $attributes));
}

test('ads list does not expose the author phone, email or ip', function (string $type) {
    $author = makeUser(Roles::EMPLOYEE->value);
    $author->forceFill(['ip' => '203.0.113.7'])->save();
    makeAd($author->id, ['type' => $type]);

    $this->get("/ads?type={$type}")
        ->assertOk()
        ->assertSee($author->name)
        ->assertDontSee((string) $author->phone)
        ->assertDontSee((string) $author->email)
        ->assertDontSee('203.0.113.7');
})->with([AdType::SERVICE->value, AdType::PRODUCT->value]);

test('ad page keeps the advertised phone but hides the author contacts', function () {
    $author = makeUser(Roles::EMPLOYEE->value);
    $author->forceFill(['ip' => '203.0.113.7'])->save();
    $ad = makeAd($author->id, ['phone' => '77011112233']);

    $this->get("/ad/{$ad->id}")
        ->assertOk()
        ->assertInertia(
            fn (\Inertia\Testing\AssertableInertia $page) => $page
                ->component('AdService')
                // Номер объявления — публичный контакт продавца (иконка WhatsApp на странице).
                ->where('ad.phone', '77011112233')
                ->where('ad.user.name', $author->name)
                ->missing('ad.user.phone')
                ->missing('ad.user.email')
                ->missing('ad.user.ip')
        );
});

test('ad contact still uses the author profile phone when the ad asks for it', function () {
    $author = makeUser(Roles::EMPLOYEE->value);
    $visitor = makeUser(Roles::EMPLOYEE->value);
    $ad = makeAd($author->id, ['phone' => null, 'use_profile_phone' => true]);

    $this->actingAs($visitor)
        ->post("/ad/connect/{$ad->id}")
        ->assertRedirectContains("https://wa.me/{$author->phone}");
});

function seedAdContacts(int $userId, int $adId, int $count, $contactedAt = null): void
{
    AdContact::insert(array_fill(0, $count, [
        'ad_id' => $adId,
        'user_id' => $userId,
        'contacted_at' => $contactedAt ?? now(),
    ]));
}

test('contacting a seller records the contact once per ad within 24 hours', function () {
    $author = makeUser(Roles::EMPLOYEE->value);
    $visitor = makeUser(Roles::EMPLOYEE->value);
    $ad = makeAd($author->id);

    $this->actingAs($visitor);
    $this->post("/ad/connect/{$ad->id}")->assertRedirectContains('https://wa.me/77011112233');
    $this->post("/ad/connect/{$ad->id}")->assertRedirectContains('https://wa.me/77011112233');

    $this->assertDatabaseCount('ad_contacts', 1);
    expect($ad->fresh()->contacts_shown_count)->toBe(1);
});

test('the thirty first seller contact in 24 hours is rejected with the unlock time', function () {
    config(['app.debug' => false]);
    $this->travelTo(now()->setDate(2026, 11, 16)->setTime(10, 0));
    $author = makeUser(Roles::EMPLOYEE->value);
    $visitor = makeUser(Roles::EMPLOYEE->value);
    $seen = makeAd($author->id);
    $fresh = makeAd($author->id);
    seedAdContacts($visitor->id, $seen->id, 1, now()->subDay()->setTime(14, 30));
    seedAdContacts($visitor->id, $seen->id, 29);

    $this->actingAs($visitor)
        ->post("/ad/connect/{$fresh->id}")
        ->assertStatus(429)
        ->assertHeader('Retry-After', (string) (4 * 3600 + 30 * 60))
        ->assertSee(__('responses.ad_contact_daily_limit', ['limit' => 30, 'time' => '14:30']))
        ->assertHeaderMissing('Location');

    // Чат с уже открытым продавцом по-прежнему открывается.
    $this->post("/ad/connect/{$seen->id}")->assertRedirectContains('https://wa.me/');

    $this->assertDatabaseCount('ad_contacts', 30);
});

test('an inertia seller contact over the limit returns a form error', function () {
    $author = makeUser(Roles::EMPLOYEE->value);
    $visitor = makeUser(Roles::EMPLOYEE->value);
    $seen = makeAd($author->id);
    $fresh = makeAd($author->id);
    seedAdContacts($visitor->id, $seen->id, 30);

    $this->actingAs($visitor)
        ->from("/ad/{$fresh->id}")
        ->withHeaders(['X-Inertia' => 'true'])
        ->post("/ad/connect/{$fresh->id}")
        ->assertRedirect("/ad/{$fresh->id}")
        ->assertSessionHasErrors('connect');
});

test('an inertia seller contact gets an external location to whatsapp', function () {
    $author = makeUser(Roles::EMPLOYEE->value);
    $visitor = makeUser(Roles::EMPLOYEE->value);
    $ad = makeAd($author->id);

    $response = $this->actingAs($visitor)
        ->withHeaders(['X-Inertia' => 'true'])
        ->post("/ad/connect/{$ad->id}")
        ->assertStatus(409);

    $location = $response->headers->get('X-Inertia-Location');

    // Заголовок читается браузером как Latin-1: в нём не должно быть сырой кириллицы.
    expect($location)->toMatch('/^[\x21-\x7E]+$/')
        ->and($location)->toBe('https://wa.me/77011112233?text='.rawurlencode("Здравствуйте!\n\nПишу с Jumystap.\n\n"))
        ->and(urldecode($location))->toContain("Здравствуйте!\n\nПишу с Jumystap.");
});

test('the legacy get contact url redirects to the ad without recording a contact', function () {
    $author = makeUser(Roles::EMPLOYEE->value);
    $visitor = makeUser(Roles::EMPLOYEE->value);
    $ad = makeAd($author->id);

    $this->actingAs($visitor)
        ->get("/ad/connect/{$ad->id}")
        ->assertRedirect("/ad/{$ad->id}");

    $this->assertDatabaseCount('ad_contacts', 0);
});

test('inactive ads cannot be contacted and do not disclose the phone', function (AdStatus $status) {
    $author = makeUser(Roles::EMPLOYEE->value);
    $visitor = makeUser(Roles::EMPLOYEE->value);
    $ad = makeAd($author->id, ['status' => $status->value, 'phone' => null, 'use_profile_phone' => true]);

    $this->actingAs($visitor)
        ->post("/ad/connect/{$ad->id}")
        ->assertNotFound();

    $this->assertDatabaseCount('ad_contacts', 0);
})->with([AdStatus::DRAFT, AdStatus::MODERATION, AdStatus::INACTIVE]);

test('guests are sent to login instead of contacting a seller', function () {
    $author = makeUser(Roles::EMPLOYEE->value);
    $ad = makeAd($author->id);

    $this->post("/ad/connect/{$ad->id}")->assertRedirect('/login');

    $this->assertDatabaseCount('ad_contacts', 0);
});

test('the ad page offers the contact button only for active ads', function (AdStatus $status, bool $canContact) {
    $author = makeUser(Roles::EMPLOYEE->value);
    $admin = makeUser(Roles::ADMIN->value);
    $ad = makeAd($author->id, ['status' => $status->value]);

    $this->actingAs($admin)
        ->get("/ad/{$ad->id}")
        ->assertOk()
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page->where('canContact', $canContact));
})->with([
    'active' => [AdStatus::ACTIVE, true],
    'moderation' => [AdStatus::MODERATION, false],
]);
