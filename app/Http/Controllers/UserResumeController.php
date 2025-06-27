<?php

namespace App\Http\Controllers;

use App\Models\UserResume;
use App\Models\SpecializationCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            'organizations' => 'nullable|array',
            'languages' => 'required|array',
        ]);

        $data['user_id'] = Auth::id();

        if ($request->hasFile('photo_path')) {
            $data['photo_path'] = $request->file('photo_path')->store('resume', 'public');
        }

        $resume = UserResume::create($data);

        if(!empty($data['organizations'])){
            foreach ($data['organizations'] as $organization) {
                $resume->organizations()->create($organization);
            }
        }

        foreach ($data['languages'] as $language) {
            $resume->languages()->create(['language' => $language]);
        }

        return redirect('/profile');
    }

    public function show($id)
    {
        $resume = UserResume::where('id', $id)
            ->with(['organizations', 'languages'])
            ->first();

        $resume->desired_field_name = $this->getSpecializationName($resume->desired_field);

        $resume->organizations = $resume->organizations->map(function ($organization) {
            $organization->position_name = $this->getSpecializationName($organization->position_id);
            return $organization;
        });

        $user = User::find($resume->user_id);
        return Inertia::render('Resume', [
            'resume' => $resume,
            'user' => $user,
        ]);
    }

    private function getSpecializationName($id)
    {
        return DB::table('specializations')->where('id', $id)->value('name_ru');
    }


    public function edit($id)
    {
        $resume = UserResume::where('id', $id)->with('organizations')->first();
        $specializations = SpecializationCategory::with('specialization')->get();
        return Inertia::render('UpdateResume', [
            'resume' => $resume,
            'languages' => collect($resume->languages)->pluck('language')->toArray(),
            'specializations' => $specializations,
        ]);
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
            'desired_field' => 'required',
            'skills' => 'required|array',
            'photo_path' => 'nullable|file|image',
            'organizations' => 'required|array',
            'languages' => 'required|array',
        ]);

        if ($request->hasFile('photo_path')) {
            $data['photo_path'] = $request->file('photo_path')->store('photos');
        }

        $resume->update($data);

        $resume->organizations()->delete();
        foreach ($data['organizations'] as $organization) {
            $resume->organizations()->create($organization);
        }

        $resume->languages()->delete();
        foreach ($data['languages'] as $language) {
            $resume->languages()->create(['language' => $language]);
        }

        return redirect('/profile');
    }

    public function destroy($id)
    {
        $resume = UserResume::find($id);
        $resume->delete();
        return redirect('/profile');
    }
}
