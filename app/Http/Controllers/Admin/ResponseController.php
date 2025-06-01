<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Response;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;

class ResponseController extends Controller
{
    public function index(): Factory|View|Application
    {
        return view('admin.responses.index')
            ->with('responses', Response::query()->latest()->paginate(100)->appends(request()->query()));
    }

}

