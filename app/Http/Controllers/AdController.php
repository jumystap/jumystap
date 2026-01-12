<?php

namespace App\Http\Controllers;

use App\Enums\AdType;
use App\Services\AdService;
use App\Enums\AdStatus;
use App\Enums\Roles;
use App\Models\City;
use App\Models\Profession\Profession;
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
            'type'        => $request->input('type'),
            'category_id' => $request->input('category_id'),
            'city_id'     => $request->input('city_id'),
        ];

        $ads = $this->adService->getAllActiveAds($filters)->withQueryString();
        return Inertia::render('Ads', [
            'ads'        => $ads,
            'categories' => Profession::query()->orderBy('id')->pluck('name_ru', 'id')->toArray(),
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

            return Inertia::render('Ad', [
                'ad' => $ad,
            ]);
        }

        return redirect('ads');
    }

}

