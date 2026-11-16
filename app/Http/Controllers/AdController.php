<?php

namespace App\Http\Controllers;

use App\Enums\AdType;
use App\Models\AdCategory;
use App\Services\AdService;
use App\Enums\AdStatus;
use App\Enums\Roles;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

class AdController extends Controller
{
    public function __construct(private readonly AdService $adService)
    {
    }

    public function index(Request $request): Response
    {
        $filters = [
            'keyword'     => $request->input('keyword'),
            'type'        => $request->input('type') ?? 'product',
            'category_id' => $request->input('category_id'),
            'city_id'     => $request->input('city_id'),
            'price_from'  => $request->input('price_from'),
            'price_to'    => $request->input('price_to'),
            'is_joltap'   => $request->boolean('is_joltap'),
            'is_negotiable' => $request->boolean('is_negotiable'),
        ];

        $ads = $this->adService->getAllActiveAds($filters)->withQueryString();
        return Inertia::render('Ads', [
            'ads'        => $ads,
            'categories' => AdCategory::query()->orderBy('id')->pluck('name_ru', 'id')->toArray(),
            'types' => AdType::options(),
            'cities'     => City::query()->orderBy('order_id')->get(['id', 'title']),
        ]);
    }

    public function index2(Request $request): Response
    {
        $filters = [
            'keyword'     => $request->input('keyword'),
            'type'        => $request->input('type'),
            'category_id' => $request->input('category_id'),
            'city_id'     => $request->input('city_id'),
            'price_from'  => $request->input('price_from'),
            'price_to'    => $request->input('price_to'),
            'is_joltap'   => $request->boolean('is_joltap'),
            'is_negotiable' => $request->boolean('is_negotiable'),
        ];

        $ads = $this->adService->getAllActiveAds($filters)->withQueryString();
        return Inertia::render('AdsProduct', [
            'ads'        => $ads,
            'categories' => AdCategory::query()->orderBy('id')->pluck('name_ru', 'id')->toArray(),
            'types' => AdType::options(),
            'cities'     => City::query()->orderBy('order_id')->pluck('title', 'id')->toArray(),
        ]);
    }

    public function show($id): mixed
    {
        $ad = $this->adService->getAd($id);

        if (
            $ad->status === AdStatus::ACTIVE ||
            (Auth::check() && Auth::user()->role_id === Roles::ADMIN->value)
        ) {

            $this->adService->createViews($ad, [
                'user_id' => Auth()->id(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'viewed_at' => now(),
            ]);

            $component = 'AdProduct';
            if ($ad->type == AdType::SERVICE){
                $component = 'AdService';
            }
            // Публичная страница отдаёт об авторе только то, что показывает; полную модель
            // (с phone, email, ip) getAdById грузит ради connect, которому нужен номер профиля.
            $ad->user?->setVisible(['id', 'name', 'description', 'image_url', 'is_graduate', 'ads']);

            return Inertia::render($component, [
                'ad' => $ad,
                // Неактивное объявление видит только админ; /ad/connect для него отдаёт 404.
                'canContact' => $ad->status === AdStatus::ACTIVE,
                'category' => $ad->category->name,
            ]);
        }

        return redirect('ads');
    }

    public function connect(Request $request, int $ad_id): SymfonyResponse
    {
        try {
            $url = $this->adService->contactAd((int) $request->user()->id, $ad_id, [
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        } catch (TooManyRequestsHttpException $e) {
            // Из интерфейса (Inertia) — ошибка формы для уведомления, а не страница 429 во всплывающем окне.
            if ($request->inertia()) {
                return back()->withErrors(['connect' => $e->getMessage()]);
            }

            throw $e;
        }

        // Для Inertia — 409 с X-Inertia-Location (клиент сам уйдёт на wa.me), иначе редирект.
        return Inertia::location($url);
    }

}

