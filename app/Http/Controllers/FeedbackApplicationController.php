<?php

namespace App\Http\Controllers;

use App\Http\Requests\Feedback\StoreFeedbackApplicationRequest;
use App\Services\FeedbackApplicationService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class FeedbackApplicationController extends Controller
{
    public function __construct(private FeedbackApplicationService $feedbackApplicationService) {}

    public function store(StoreFeedbackApplicationRequest $request): JsonResponse
    {
        $this->feedbackApplicationService->submit($request->validated());

        return response()->json([
            'message' => 'Application submitted successfully',
        ], Response::HTTP_CREATED);
    }
}
