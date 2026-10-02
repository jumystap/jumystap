<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Геокодирование через HTTP-сервис Яндекса.
 *
 * Почему не ymaps.geocode() в браузере: ключ может быть подключён к «API
 * Геокодера», но не к «JavaScript API» — тогда JS API отвергает его и
 * геокодирование падает со scriptError, хотя карта рисуется. HTTP-сервис
 * тот же ключ принимает, поэтому ходим в него с сервера.
 */
class YandexGeocoderService
{
    private const GEOCODE_URI = 'https://geocode-maps.yandex.ru/1.x/';

    private const TIMEOUT = 5;

    public function configured(): bool
    {
        return filled(config('services.yandex_maps.key'));
    }

    /**
     * Прямое и обратное геокодирование. Для обратного $geocode — «lon,lat».
     * $bbox ограничивает поиск городом, формат «lon1,lat1~lon2,lat2».
     *
     * @return array{address: string, latitude: float, longitude: float}|null
     */
    public function geocode(string $geocode, ?string $bbox = null, string $lang = 'ru_RU'): ?array
    {
        return ($this->search($geocode, $bbox, $lang, 1) ?? [])[0] ?? null;
    }

    /**
     * Несколько кандидатов под выпадающий список. Отдельный Геосаджест не
     * нужен: геокодер на неполный запрос («Алматы, Абая») возвращает список
     * улиц и объектов, чего для выбора адреса достаточно.
     *
     * Возвращает null, если сервис не ответил (403 при ключе без геокодера,
     * 429, таймаут) — это не то же самое, что «ничего не найдено», и вызывающий
     * код должен показать разные сообщения.
     *
     * @return array<int, array{address: string, latitude: float, longitude: float, kind: string}>|null
     */
    public function search(string $geocode, ?string $bbox = null, string $lang = 'ru_RU', int $results = 7): ?array
    {
        $query = [
            'apikey' => config('services.yandex_maps.key'),
            'geocode' => $geocode,
            'lang' => $lang,
            'format' => 'json',
            'results' => $results,
        ];

        if ($bbox) {
            $query['bbox'] = $bbox;
            $query['rspn'] = 1;
        }

        // Ключ ограничен по домену (HTTP Referer). Браузер шлёт его сам, а
        // серверный запрос — нет, и Яндекс отвечает 403 «Invalid api key».
        // Подставляем адрес нашего же приложения — запрос от него и идёт.
        try {
            $response = Http::timeout(self::TIMEOUT)
                ->withHeaders(['Referer' => rtrim(config('app.url'), '/').'/'])
                ->get(self::GEOCODE_URI, $query);
        } catch (ConnectionException $e) {
            // Таймаут/сеть: без catch это улетело бы 500-й на фронт.
            Log::warning('Yandex geocode unreachable', ['message' => $e->getMessage()]);

            return null;
        }

        if ($response->failed()) {
            Log::warning('Yandex geocode failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        }

        return collect($response->json('response.GeoObjectCollection.featureMember') ?? [])
            // Рамка Казахстана — прямоугольник, он захватывает приграничные
            // куски России, Узбекистана, Киргизии и Китая. Отсекаем их по
            // стране, иначе в подсказках всплывают зарубежные адреса.
            ->reject(fn (array $item) => $this->isForeign($item['GeoObject'] ?? []))
            ->map(function (array $item) {
                $object = $item['GeoObject'] ?? [];

                // Яндекс отдаёт «долгота широта» одной строкой через пробел.
                [$longitude, $latitude] = array_pad(
                    explode(' ', data_get($object, 'Point.pos', '')),
                    2,
                    null
                );

                if ($longitude === null || $latitude === null) {
                    return null;
                }

                $full = data_get($object, 'metaDataProperty.GeocoderMetaData.text', '');

                return [
                    // Короткий вид идёт в поле адреса вакансии: город выводится
                    // рядом отдельно, и «Алматы, Казахстан, Алматы, улица…»
                    // в шапке дублировалось.
                    'address' => $this->shortAddress($object) ?: $full,
                    // Полный — для выпадающего списка, где город помогает
                    // отличить одноимённые улицы.
                    'full' => $full,
                    'latitude' => (float) $latitude,
                    'longitude' => (float) $longitude,
                    'kind' => data_get($object, 'metaDataProperty.GeocoderMetaData.kind', ''),
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    /**
     * Адрес за пределами Казахстана. Если страну геокодер не вернул,
     * считаем адрес своим — лучше показать лишнее, чем потерять нужное.
     */
    private function isForeign(array $object): bool
    {
        $country = collect(data_get($object, 'metaDataProperty.GeocoderMetaData.Address.Components', []))
            ->firstWhere('kind', 'country')['name'] ?? null;

        if ($country === null) {
            return false;
        }

        return ! in_array(mb_strtolower($country), ['казахстан', 'kazakhstan', 'qazaqstan'], true);
    }

    /**
     * Собирает адрес без страны, области и города — их на странице вакансии
     * показывают отдельным полем. Пустая строка, если после отсева ничего
     * не осталось (например, найден сам город) — тогда вызывающий код берёт
     * полный адрес.
     */
    private function shortAddress(array $object): string
    {
        $skip = ['country', 'region', 'province', 'area', 'locality'];

        return collect(data_get($object, 'metaDataProperty.GeocoderMetaData.Address.Components', []))
            ->reject(fn (array $component) => in_array($component['kind'] ?? '', $skip, true))
            ->pluck('name')
            ->filter()
            ->implode(', ');
    }
}
