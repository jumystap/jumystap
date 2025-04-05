<?php

namespace App\Http\Controllers;

use App\Models\AnalyticByClick;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        AnalyticByClick::query()->create([
            'parameter_id' => $request->parameter_id,
        ]);

        return response()->json(['success' => true]);
    }
}
