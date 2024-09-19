<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Resume;
use App\Models\ResumeSpecialization;
use Illuminate\Support\Facades\Auth;

class ResumeController extends Controller
{
    public function create(Request $request): mixed
    {
        $validated = $request->validate([
            'city' => 'required|string',
            'area' => 'nullable|string',
            'selectedSpecializations' => 'nullable|array'
        ]);

        $resume = Resume::create([
            'user_id' => Auth::user()->id,
            'city' => $validated['city'],
            'area' => $validated['area'] ?? null,
        ]);

        if (isset($validated['selectedSpecializations']) && is_array($validated['selectedSpecializations'])) {
            foreach ($validated['selectedSpecializations'] as $specialization_id) {
                ResumeSpecialization::create([
                    'resume_id' => $resume->id,
                    'specialization_id' => $specialization_id,
                ]);
            }
        }

        return redirect('/');
    }
}

