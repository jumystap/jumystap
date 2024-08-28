<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index(): mixed
    {
        $reviews = Review::orderBy('created_at', 'desc')->get();
        return Inertia::render('Reviews', [
            'reviews' => $reviews,
        ]);
    }

    public function create(Request $request): mixed
    {
        Review::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'review' => $request->review,
        ]);

        return redirect('/reviews');
    }
}
