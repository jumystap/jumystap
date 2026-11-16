<?php

use App\Enums\Roles;
use Illuminate\Support\Facades\Http;

function fakeYandex(array $featureMembers, int $status = 200): void
{
    config(['services.yandex_maps.key' => 'test-key']);
    Http::fake([
        'geocode-maps.yandex.ru/*' => Http::response(
            ['response' => ['GeoObjectCollection' => ['featureMember' => $featureMembers]]],
            $status
        ),
    ]);
}

function kazakhAddress(string $street = 'улица Абая', string $house = '150'): array
{
    return [
        'GeoObject' => [
            'metaDataProperty' => [
                'GeocoderMetaData' => [
                    'text' => "Казахстан, Алматы, {$street}, {$house}",
                    'kind' => 'house',
                    'Address' => [
                        'Components' => [
                            ['kind' => 'country', 'name' => 'Казахстан'],
                            ['kind' => 'locality', 'name' => 'Алматы'],
                            ['kind' => 'street', 'name' => $street],
                            ['kind' => 'house', 'name' => $house],
                        ],
                    ],
                ],
            ],
            'Point' => ['pos' => '76.883742 43.237583'],
        ],
    ];
}

function asEmployer()
{
    return test()->actingAs(makeUser(Roles::EMPLOYER->value));
}

it('закрыт для гостей: иначе это открытый прокси к платному API', function () {
    $this->get('/address/suggest?text=Алматы')->assertRedirect('/login');
    $this->get('/address/geocode?geocode=Алматы')->assertRedirect('/login');
});

it('отдаёт короткий адрес и полный для списка', function () {
    fakeYandex([kazakhAddress()]);

    asEmployer()->get('/address/geocode?geocode='.urlencode('Алматы, Абая 150'))
        ->assertOk()
        ->assertJson([
            'configured' => true,
            'failed' => false,
            'result' => [
                'address' => 'улица Абая, 150',
                'full' => 'Казахстан, Алматы, улица Абая, 150',
                'latitude' => 43.237583,
                'longitude' => 76.883742,
            ],
        ]);
});

it('помечает отказ сервиса флагом failed', function () {
    fakeYandex([], 403);

    // 403 не должен выглядеть как «адрес не найден» — иначе работодатель
    // будет бесконечно переписывать корректный адрес.
    asEmployer()->get('/address/geocode?geocode=Алматы')
        ->assertOk()
        ->assertJson(['configured' => true, 'failed' => true, 'result' => null]);
});

it('не помечает failed, когда адрес действительно не найден', function () {
    // Отдельным тестом: повторный Http::fake не заменяет уже заданный стаб.
    fakeYandex([]);

    asEmployer()->get('/address/geocode?geocode=Алматы')
        ->assertOk()
        ->assertJson(['configured' => true, 'failed' => false, 'result' => null]);
});

it('сообщает, что сервис не настроен, вместо падения', function () {
    config(['services.yandex_maps.key' => null]);

    asEmployer()->get('/address/geocode?geocode=Алматы')
        ->assertOk()
        ->assertJson(['configured' => false, 'result' => null]);
});

it('возвращает список кандидатов для подсказок', function () {
    fakeYandex([kazakhAddress('улица Абая'), kazakhAddress('проспект Абая', '10')]);

    asEmployer()->get('/address/suggest?text='.urlencode('Алматы, Абая'))
        ->assertOk()
        ->assertJsonCount(2, 'results')
        ->assertJsonPath('results.0.address', 'улица Абая, 150');
});

it('требует текст и ограничивает его длину', function () {
    asEmployer()->getJson('/address/suggest')->assertStatus(422);
    asEmployer()->getJson('/address/suggest?text='.str_repeat('а', 256))->assertStatus(422);
    asEmployer()->getJson('/address/geocode')->assertStatus(422);
});

it('прокидывает рамку в запрос к Яндексу', function () {
    fakeYandex([kazakhAddress()]);

    asEmployer()->get('/address/geocode?geocode=Абая&bbox='.urlencode('46.49,40.57~87.32,55.45'))
        ->assertOk();

    Http::assertSent(fn ($request) => str_contains(urldecode($request->url()), '46.49,40.57~87.32,55.45'));
});
