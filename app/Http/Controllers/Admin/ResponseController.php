<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Response;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

class ResponseController extends Controller
{
    public function index(Request $request): Factory|View|Application
    {
        $search = $request->get('search');

        if (!$search) {
            $search = [
                'start_date'    => null,
                'end_date'      => null,
            ];
        }

        return view('admin.responses.index')
            ->with('responses', Response::query()->latest()->paginate(100)->appends(request()->query()))
            ->with('search', $search);
    }

}

