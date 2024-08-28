<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    public function store(Request $request): mixed
    {
        Log::info('Portfolio update process started.', [
            'user_id' => Auth::id(),
        ]);

        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $user = Auth::user();

            $image_url = $request->file('image')->store('portfolio', 'public');

            Portfolio::create([
                'user_id' => $user->id,
                'image_url' => $image_url,
            ]);

            Log::info('Portfolio updated successfully.', [
                'user_id' => $user->id,
                'image_url' => $image_url,
            ]);

            return redirect('/')->with('success', 'Portfolio updated successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to update portfolio.', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return redirect('/')->with('error', 'Failed to update portfolio.');
        }
    }

    public function delete($id): RedirectResponse
    {
        Log::info('Portfolio delete process started.', [
            'user_id' => Auth::id(),
            'portfolio_id' => $id,
        ]);

        try {
            $user = Auth::user();
            $portfolio = Portfolio::where('user_id', $user->id)->findOrFail($id);

            Storage::disk('public')->delete($portfolio->image_url);

            $portfolio->delete();

            Log::info('Portfolio deleted successfully.', [
                'user_id' => $user->id,
                'portfolio_id' => $id,
            ]);

            return redirect('/profile')->with('success', 'Portfolio deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to delete portfolio.', [
                'user_id' => Auth::id(),
                'portfolio_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return redirect('/profile')->with('error', 'Failed to delete portfolio.');
        }
    }
}
