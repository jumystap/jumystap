<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PlacementSurveyService;
use Illuminate\Contracts\View\View;

class PlacementSurveyController extends Controller
{
    public function __construct(private PlacementSurveyService $placementSurveyService) {}

    public function index(): View
    {
        return view('admin.placement-surveys.index', [
            'surveys' => $this->placementSurveyService->paginateForAdmin(),
        ]);
    }
}
