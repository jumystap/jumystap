<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Favorite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index(): mixed
    {
        $user_id = Auth::id();
        $announcements = Announcement::whereIn('id', function ($query) use ($user_id) {
            $query->select('announcement_id')
                  ->from('favorites')
                  ->where('user_id', $user_id);
        })->get();

        return Inertia::render('Favs', [
            'announcements' => $announcements,
        ]);
    }

    public function store($id)
    {
        try{
            $fav = Favorite::create([
                'user_id' => Auth::id(),
                'announcement_id' => $id,
            ]);
            Log::info($fav);
        } catch (\Exception $e) {
            Log::info($e);
        }
    }

    public function delete($id): void
    {
        try {
            $favorite = Favorite::where('announcement_id', $id)->where('user_id', Auth::id())->first();
            $favorite->delete();
        } catch (\Exception $e) {
            Log::error('Error deleting favorite', ['exception' => $e]);
        }
    }
}
