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

        $responses = Response::search($search)
            // Связи грузятся сразу (иначе по 3 запроса на строку × 100 строк) и вместе с
            // мягко удалёнными записями: админке нужно видеть, на что откликались, а не «—».
            ->with([
                'user' => fn ($query) => $query->withTrashed(),
                'announcement' => fn ($query) => $query->withTrashed(),
                'announcement.user' => fn ($query) => $query->withTrashed(),
            ])
            ->latest()
            ->paginate(100)
            ->appends(request()->query());

        return view('admin.responses.index')
            ->with('responses', $responses)
            ->with('search', $search);
    }

}

