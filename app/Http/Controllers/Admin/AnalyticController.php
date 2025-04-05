<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AnalyticByClick;
use App\Models\AnalyticParameter;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

class AnalyticController extends Controller
{
    public function clicks(Request $request): Factory|View|Application
    {
        $search = $request->get('search');

        if (!$search) {
            $search = [
                'parameter_id' => null,
                'start_date'    => null,
                'end_date'      => null,
            ];
        }

        return view('admin.analytics.clicks')
            ->with('clicks', AnalyticByClick::search($search)->latest()->paginate(100)->appends(request()->query()))
            ->with('parameters', AnalyticParameter::all())
            ->with('search', $search);
    }

}

