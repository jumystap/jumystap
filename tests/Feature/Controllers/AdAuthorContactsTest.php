<?php

use App\Enums\AdStatus;
use App\Enums\AdType;
use App\Enums\PriceType;
use App\Enums\Roles;
use App\Models\Ad;
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
        ->get("/ad/connect/{$ad->id}")
        ->assertRedirectContains("https://wa.me/{$author->phone}");
});
