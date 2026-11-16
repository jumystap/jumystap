<?php

use App\Services\YandexGeocoderService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

// Pest подключает TestCase только для Feature — юнит-тесту приложение
// нужно поднять явно. База здесь не трогается, RefreshDatabase не нужен.
uses(TestCase::class);

/**
 * Ответ геокодера в том виде, в каком его отдаёт Яндекс: координаты одной
 * строкой «долгота широта», адрес разложен по компонентам.
 */
function geoObject(array $components, string $text, string $pos): array
{
    return [
        'GeoObject' => [
            'metaDataProperty' => [
                'GeocoderMetaData' => [
                    'text' => $text,
                    'kind' => 'house',
                    'Address' => [
                        'Components' => collect($components)
                            ->map(fn ($name, $kind) => ['kind' => $kind, 'name' => $name])
                            ->values()
                            ->all(),
                    ],
                ],
            ],
            'Point' => ['pos' => $pos],
        ],
    ];
}

function geoResponse(array $objects): array
{
    return ['response' => ['GeoObjectCollection' => ['featureMember' => $objects]]];
}

function fakeGeocoder(array $objects): void
{
    config(['services.yandex_maps.key' => 'test-key']);
    Http::fake(['geocode-maps.yandex.ru/*' => Http::response(geoResponse($objects), 200)]);
}

beforeEach(function () {
    config(['services.yandex_maps.key' => 'test-key']);
});

it('разбирает координаты в порядке «долгота широта»', function () {
    fakeGeocoder([
        geoObject(
            ['country' => 'Казахстан', 'locality' => 'Алматы', 'street' => 'улица Абая', 'house' => '150'],
            'Казахстан, Алматы, улица Абая, 150',
            '76.883742 43.237583' // Яндекс отдаёт долготу первой
        ),
    ]);

    $result = app(YandexGeocoderService::class)->geocode('Алматы, Абая 150');

    expect($result['latitude'])->toBe(43.237583)
        ->and($result['longitude'])->toBe(76.883742);
});

it('сохраняет короткий адрес без страны и города, но отдаёт полный для списка', function () {
    fakeGeocoder([
        geoObject(
            [
                'country' => 'Казахстан',
                'province' => 'Алматы',
                'locality' => 'Алматы',
                'street' => 'улица Абдуллы Розыбакиева',
                'house' => '75',
            ],
            'Казахстан, Алматы, улица Абдуллы Розыбакиева, 75',
            '76.9 43.2'
        ),
    ]);

    $result = app(YandexGeocoderService::class)->geocode('Алматы, Розыбакиева 75');

    // Город выводится на странице вакансии отдельно — иначе «Алматы, Казахстан, Алматы, улица…»
    expect($result['address'])->toBe('улица Абдуллы Розыбакиева, 75')
        ->and($result['full'])->toBe('Казахстан, Алматы, улица Абдуллы Розыбакиева, 75');
});

it('откатывается на полный адрес, когда после отсева ничего не осталось', function () {
    fakeGeocoder([
        geoObject(['country' => 'Казахстан', 'locality' => 'Алматы'], 'Казахстан, Алматы', '76.9 43.2'),
    ]);

    // Найден сам город: улицы и дома нет, пустую строку в поле писать нельзя.
    expect(app(YandexGeocoderService::class)->geocode('Алматы')['address'])
        ->toBe('Казахстан, Алматы');
});

it('отсекает адреса за пределами Казахстана', function () {
    fakeGeocoder([
        geoObject(['country' => 'Россия', 'locality' => 'Москва', 'street' => 'Тверская'], 'Россия, Москва', '37.6 55.7'),
        geoObject(['country' => 'Казахстан', 'locality' => 'Алматы', 'street' => 'улица Абая'], 'Казахстан, Алматы', '76.9 43.2'),
    ]);

    $results = app(YandexGeocoderService::class)->search('Абая');

    expect($results)->toHaveCount(1)
        ->and($results[0]['full'])->toContain('Казахстан');
});

it('не отбрасывает адрес, у которого геокодер не вернул страну', function () {
    fakeGeocoder([
        geoObject(['street' => 'улица Абая', 'house' => '1'], 'улица Абая, 1', '76.9 43.2'),
    ]);

    expect(app(YandexGeocoderService::class)->search('Абая 1'))->toHaveCount(1);
});

it('возвращает null при отказе сервиса, а не пустой список', function () {
    config(['services.yandex_maps.key' => 'test-key']);
    Http::fake([
        'geocode-maps.yandex.ru/*' => Http::response(['message' => 'Invalid api key'], 403),
    ]);

    // Отказ и «ничего не найдено» — разные вещи: по ним показываются
    // разные сообщения, иначе 403 выглядит как «адрес не найден».
    expect(app(YandexGeocoderService::class)->search('Алматы'))->toBeNull();
});

it('возвращает null при таймауте, а не роняет запрос', function () {
    config(['services.yandex_maps.key' => 'test-key']);
    Http::fake(fn () => throw new ConnectionException('timeout'));

    expect(app(YandexGeocoderService::class)->search('Алматы'))->toBeNull();
});

it('отдаёт пустой список, когда адрес действительно не найден', function () {
    fakeGeocoder([]);

    expect(app(YandexGeocoderService::class)->search('несуществующий адрес'))->toBe([]);
});

it('ограничивает выдачу рамкой только когда она передана', function () {
    fakeGeocoder([]);

    app(YandexGeocoderService::class)->search('Абая', '46.49,40.57~87.32,55.45');

    Http::assertSent(function ($request) {
        // rspn=1 превращает рамку из подсказки в жёсткое ограничение
        return str_contains($request->url(), 'bbox=') && str_contains($request->url(), 'rspn=1');
    });
});

it('шлёт Referer: ключ ограничен по домену и без заголовка Яндекс отвечает 403', function () {
    fakeGeocoder([]);
    config(['app.url' => 'https://jumystap.kz']);

    app(YandexGeocoderService::class)->search('Абая');

    Http::assertSent(fn ($request) => $request->header('Referer')[0] === 'https://jumystap.kz/');
});

it('считает сервис ненастроенным без ключа', function () {
    config(['services.yandex_maps.key' => null]);

    expect(app(YandexGeocoderService::class)->configured())->toBeFalse();
});
