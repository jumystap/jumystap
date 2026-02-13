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
            'cities'     => City::query()->orderBy('order_id')->pluck('title', 'id')->toArray(),
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
            return Inertia::render($component, [
                'ad' => $ad,
                'category' => $ad->category->name,
            ]);
        }

        return redirect('ads');
    }

    public function connect(int $id): mixed
    {
        $ad = $this->adService->getAd($id);

        if($ad->use_profile_phone){
            $phone = $ad->user->phone;
        }else{
            $phone = $ad->phone;
        }

        $this->adService->createContact($ad, [
            'user_id' => Auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'contacted_at' => now(),
        ]);

        $whatsappUrl = "https://wa.me/" . $phone . "?text=Здравствуйте!%0A%0AПишу%20с%20Jumystap.%0A%0A";

        return redirect()->away($whatsappUrl);
    }

}

