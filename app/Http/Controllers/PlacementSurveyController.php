<?php

namespace App\Http\Controllers;

use App\Http\Requests\Survey\StorePlacementSurveyRequest;
use App\Services\PlacementSurveyService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class PlacementSurveyController extends Controller
{
    public function __construct(private PlacementSurveyService $placementSurveyService) {}

    public function store(StorePlacementSurveyRequest $request): JsonResponse
    {
        $this->placementSurveyService->submit($request->validated());

        return response()->json([
            'message' => 'Survey submitted successfully',
        ], Response::HTTP_CREATED);
    }
}
