<?php

namespace App\Http\Controllers;

use App\Enums\DrivingLicenseCategory;
use App\Enums\EducationLevel;
use App\Enums\EmploymentType;
use App\Enums\WorkSchedule;
use App\Models\UserResume;
use Barryvdh\DomPDF\Facade\Pdf;
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
        $workSchedules   = WorkSchedule::options();
        $employmentTypes = EmploymentType::options();
        $drivingLicenses = DrivingLicenseCategory::options();
        $educationLevels = EducationLevel::options();

        return Inertia::render('CreateResume', [
            'user'            => auth()->user(),
            'workSchedules'   => $workSchedules,
            'employmentTypes' => $employmentTypes,
            'drivingLicenses' => $drivingLicenses,
            'educationLevels' => $educationLevels
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'email'                            => 'nullable|email',
            'phone'                            => 'required|max:20',
            'city'                             => 'required|string',
            'district'                         => 'nullable|string',
            'position'                         => 'required|max:100',
            'salary'                           => 'nullable|numeric',
            'employment_type_id'               => 'nullable|int',
            'work_schedule_id'                 => 'nullable|int',
            'no_work_experience'               => 'nullable|bool',
            'organizations'                    => 'nullable|array',
            'organizations.*.organization'     => 'required',
            'organizations.*.position'         => 'required',
            'organizations.*.period'           => 'required',
            'organizations.*.responsibilities' => 'nullable',
            'education_level_id'               => 'required|int',
            'educational_institution'          => 'nullable|string',
            'faculty'                          => 'nullable|string',
            'graduation_year'                  => 'nullable|integer',
            'languages'                        => 'nullable|array',
            'skills'                           => 'nullable|array',
            'ip_status'                        => 'nullable|int',
            'has_car'                          => 'nullable|string',
            'driving_license'                  => 'nullable|string',
            'about'                            => 'required|max:10000',
        ]);

        $data['user_id'] = Auth::id();

//        if ($request->hasFile('photo_path')) {
//            $data['photo_path'] = $request->file('photo_path')->store('resume', 'public');
//        }

        $resume = UserResume::query()->create($data);

        if (!empty($data['organizations'])) {
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
            ->with(['organizations', 'languages', 'user'])
            ->first();
        return Inertia::render('Resume', [
            'resume' => $resume,
        ]);
    }

    private function getSpecializationName($id)
    {
        return DB::table('specializations')->where('id', $id)->value('name_ru');
    }


    public function edit($id)
    {
        $resume          = UserResume::where('id', $id)->with('organizations')->first();
        $workSchedules   = WorkSchedule::options();
        $employmentTypes = EmploymentType::options();
        $drivingLicenses = DrivingLicenseCategory::options();
        $educationLevels = EducationLevel::options();
        return Inertia::render('UpdateResume', [
            'user'            => auth()->user(),
            'resume'          => $resume,
            'languages'       => collect($resume->languages)->pluck('language')->toArray(),
            'drivingLicenses' => $drivingLicenses,
            'employmentTypes' => $employmentTypes,
            'workSchedules'   => $workSchedules,
            'educationLevels' => $educationLevels,
        ]);
    }

    public function update(Request $request, UserResume $resume)
    {
        $data = $request->validate([
            'email'                            => 'nullable|email',
            'phone'                            => 'required|max:20',
            'city'                             => 'required|string',
            'district'                         => 'nullable|string',
            'position'                         => 'required|max:100',
            'salary'                           => 'nullable|numeric',
            'employment_type_id'               => 'nullable|int',
            'work_schedule_id'                 => 'nullable|int',
            'no_work_experience'               => 'nullable|bool',
            'organizations'                    => 'nullable|array',
            'organizations.*.organization'     => 'required',
            'organizations.*.position'         => 'required',
            'organizations.*.period'           => 'required',
            'organizations.*.responsibilities' => 'nullable',
            'education_level_id'               => 'required|int',
            'educational_institution'          => 'nullable|string',
            'faculty'                          => 'nullable|string',
            'graduation_year'                  => 'nullable|integer',
            'languages'                        => 'nullable|array',
            'skills'                           => 'nullable|array',
            'ip_status'                        => 'nullable|int',
            'has_car'                          => 'nullable|string',
            'driving_license'                  => 'nullable|string',
            'about'                            => 'required|max:10000',
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

    public function download(int $id)
    {
        $resume = UserResume::find($id);

        if(!$resume){
            return Inertia::render('NotFound');
        }
        if($resume->user_id != Auth::id()){
            return Inertia::render('NotFound');
        }

        $experience = [];
        if ($resume->organizations) {
            foreach ($resume->organizations as $organization) {
                $experience[] = [
                    'title'            => $organization->position,
                    'company'          => $organization->organization,
                    'period'           => str_replace('until_now', 'по настоящее время', $organization->period),
                    'responsibilities' => $organization->responsibilities
                ];
            }
        }

        $data = [
            'name'                  => $resume->user->name,
            'info'                  => $resume->user->gender_name . ', ' . $resume->user->age . ', ' . $resume->user->born,
            'email'                 => $resume->user->email,
            'phone'                 => '+' . $resume->user->phone,
            'address'               => $resume->city . ($resume->city == 'Астана' ? ', район ' . $resume->district : ''),
            'position'              => $resume->position,
            'salary'                => $resume->formatted_salary . ' ₸',
            'employment_type'       => $resume->employment_type,
            'work_schedule'         => $resume->work_schedule,
            'experience'            => $experience,
            'education'             => [
                'education_level' => $resume->education_level,
                'degree'          => $resume->faculty,
                'institution'     => $resume->educational_institution,
                'period'          => $resume->graduation_year,
            ],
            'languages'             => $resume->languages ? $resume->languages->pluck('language')->join(', ') : '',
            'skills'                => $resume->skills,
            'ip_status'             => $resume->ip_status ? 'Присутствует' : 'Отсутствует',
            'has_car'               => $resume->has_car ? 'Да' : 'Нет',
            'driving_license_title' => $resume->driving_license_title,
            'about'                 => $resume->about,
        ];

        $html = view('pdf.resume', $data)->render();

        $pdf = Pdf::loadHTML($html);

        return $pdf->download('resume.pdf');
    }

}
