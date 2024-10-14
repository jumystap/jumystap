<?php

namespace App\Http\Controllers;

use App\Models\UserResume;
use App\Models\SpecializationCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserResumeController extends Controller
{
    public function index()
    {
        $resumes = UserResume::with('organizations', 'languages')->get();
        return Inertia::render('Resumes/Index', ['resumes' => $resumes]);
    }

    public function create()
    {
        $specialization = SpecializationCategory::with('specialization')->get();

        return Inertia::render('CreateResume', [
            'specialization' => $specialization
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'city' => 'required|string',
            'district' => 'nullable|string',
            'education' => 'required|in:Среднее,Среднее специальное,Неоконченное высшее,Высшее',
            'faculty' => 'nullable|string',
            'specialization' => 'nullable|string',
            'graduation_year' => 'nullable|integer',
            'ip_status' => 'required|in:Присутствует,Отсутствует',
            'desired_field' => 'required|string',
            'skills' => 'required|array',
            'photo_path' => 'nullable|file|image',
            'organizations' => 'required|array',
            'languages' => 'required|array',
        ]);

        $data['user_id'] = Auth::id();

        if ($request->hasFile('photo_path')) {
            $data['photo_path'] = $request->file('photo_path')->store('photos');
        }

        $resume = UserResume::create($data);

        foreach ($data['organizations'] as $organization) {
            $resume->organizations()->create($organization);
        }

        foreach ($data['languages'] as $language) {
            $resume->languages()->create(['language' => $language]);
        }

        return redirect('/');
    }

    public function show(UserResume $resume)
    {
        $resume->load('organizations', 'languages');
        return Inertia::render('Resumes/Show', ['resume' => $resume]);
    }

    public function edit(UserResume $resume)
    {
        return Inertia::render('Resumes/Edit', ['resume' => $resume]);
    }

    public function update(Request $request, UserResume $resume)
    {
        $data = $request->validate([
            'city' => 'required|string',
            'district' => 'nullable|string',
            'education' => 'required|in:Среднее,Среднее специальное,Неоконченное высшее,Высшее',
            'faculty' => 'nullable|string',
            'specialization' => 'nullable|string',
            'graduation_year' => 'nullable|integer',
            'ip_status' => 'required|in:Присутствует,Отсутствует',
            'desired_field' => 'required|string',
            'skills' => 'required|array',
            'photo_path' => 'nullable|file|image',
            'organizations' => 'required|array',
            'languages' => 'required|array',
        ]);

        if ($request->hasFile('photo_path')) {
            $data['photo_path'] = $request->file('photo_path')->store('photos');
        }

        $resume->update($data);

        // Update organizations
        $resume->organizations()->delete();
        foreach ($data['organizations'] as $organization) {
            $resume->organizations()->create($organization);
        }

        // Update languages
        $resume->languages()->delete();
        foreach ($data['languages'] as $language) {
            $resume->languages()->create(['language' => $language]);
        }

        return redirect()->route('resumes.index');
    }

    public function destroy(UserResume $resume)
    {
        $resume->delete();
        return redirect()->route('resumes.index');
    }
}
