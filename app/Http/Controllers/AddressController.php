<?php

namespace App\Http\Controllers;

use App\Services\YandexGeocoderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Геокодирование для формы вакансии: браузер ходит сюда, потому что JS API
 * не принимает ключ, подключённый только к «API Геокодера».
 */
class AddressController extends Controller
{
    public function __construct(private readonly YandexGeocoderService $geocoder) {}

    /** Кандидаты под выпадающий список при вводе адреса. */
    public function suggest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'text' => ['required', 'string', 'max:255'],
            'bbox' => ['nullable', 'string', 'max:64'],
        ]);

        if (! $this->geocoder->configured()) {
            return response()->json(['configured' => false, 'results' => []]);
        }

        $results = $this->geocoder->search(
            $validated['text'],
            $validated['bbox'] ?? null,
            $this->lang()
        );

        return response()->json([
            'configured' => true,
            'failed' => $results === null,
            'results' => $results ?? [],
        ]);
    }

    public function geocode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'geocode' => ['required', 'string', 'max:255'],
            'bbox' => ['nullable', 'string', 'max:64'],
        ]);

        if (! $this->geocoder->configured()) {
            return response()->json(['configured' => false, 'result' => null]);
        }

        $results = $this->geocoder->search(
            $validated['geocode'],
            $validated['bbox'] ?? null,
            $this->lang(),
            1
        );

        return response()->json([
            'configured' => true,
            // Отказ сервиса и «адрес не найден» — разные вещи: фронт
            // показывает по ним разные сообщения.
            'failed' => $results === null,
            'result' => $results[0] ?? null,
        ]);
    }

    private function lang(): string
    {
        return app()->getLocale() === 'en' ? 'en_RU' : 'ru_RU';
    }
}
