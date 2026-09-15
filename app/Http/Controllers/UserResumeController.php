<?php

namespace App\Http\Controllers;

use App\Enums\AnnouncementStatus;
use App\Enums\Roles;
use App\Enums\DrivingLicenseCategory;
use App\Enums\EducationLevel;
use App\Enums\EmploymentType;
use App\Enums\ResumeStatus;
use App\Enums\WorkSchedule;
use App\Models\Announcement;
use App\Models\UserResume;
use App\Services\ResumeService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class UserResumeController extends Controller
{
    public function __construct(private ResumeService $resumeService)
    {
    }

    private function ensureResumeCreationIsAvailable()
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole(Roles::EMPLOYEE)) {
            return redirect('/profile')
                ->withErrors([
                    'error' => __('messages.errors.resume_creation_not_available'),
                ]);
        }

        return null;
    }

    public function index()
    {
        $resumes = UserResume::with('organizations', 'languages')->get();
        return Inertia::render('Resumes/Index', ['resumes' => $resumes]);
    }

    public function create()
    {
        if ($redirect = $this->ensureResumeCreationIsAvailable()) {
            return $redirect;
        }

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
        if ($redirect = $this->ensureResumeCreationIsAvailable()) {
            return $redirect;
        }

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
        $data['status'] = ResumeStatus::MODERATION;

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

        $this->resumeService->submitForModeration($resume);

        return redirect('/profile')->with('success', 'Резюме отправлено на модерацию.');
    }

    public function show($id)
    {
        $resume = UserResume::where('id', $id)
            ->with(['organizations', 'languages', 'user'])
            ->first();

        $isOwner = $resume ? $resume->user_id === Auth::id() : false;

        if ($resume && ! $resume->isPublished() && ! $isOwner && ! request()->hasValidSignature()) {
            return Inertia::render('NotFound');
        }

        $canViewContacts = $resume
            && ($this->canAuthenticatedUserViewResumeContact($resume) || request()->hasValidSignature());

        if ($resume && ! $canViewContacts) {
            $resume->makeHidden(['email', 'phone']);
            $resume->user?->makeHidden(['email', 'phone']);
        }

        $downloadUrl = $resume
            ? ($canViewContacts
                ? URL::temporarySignedRoute('resumes.download', now()->addDays(30), ['id' => $resume->id])
                : '/resumes/download/' . $resume->id)
            : null;

        return Inertia::render('Resume', [
            'resume' => $resume,
            'isOwner' => $resume ? $resume->user_id === Auth::id() : false,
            'downloadUrl' => $downloadUrl,
        ]);
    }

    public function shareLink(int $id)
    {
        $resume = UserResume::find($id);

        if (! $resume) {
            return response()->json(['message' => 'Not found'], 404);
        }

        if ($resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'url' => URL::temporarySignedRoute('resumes.show', now()->addDays(30), ['id' => $resume->id]),
        ]);
    }

    private function canAuthenticatedUserViewResumeContact(UserResume $resume): bool
    {
        $currentUser = Auth::user();

        if (! $currentUser) {
            return false;
        }

        if ($resume->user_id === $currentUser->id) {
            return true;
        }

        $employerRoleIds = collect([
            Roles::EMPLOYER->value,
            Roles::COMPANY->value,
        ]);

        if (! $employerRoleIds->contains((int) $currentUser->role_id)) {
            return false;
        }

        return Announcement::query()
            ->where('user_id', $currentUser->id)
            ->where('status', AnnouncementStatus::ACTIVE->value)
            ->exists();
    }

    private function getSpecializationName($id)
    {
        return DB::table('specializations')->where('id', $id)->value('name_ru');
    }


    public function edit($id)
    {
        $resume = UserResume::where('id', $id)->with('organizations')->firstOrFail();

        if ($resume->user_id !== Auth::id()) {
            abort(403);
        }

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
        if ($resume->user_id !== Auth::id()) {
            abort(403);
        }

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

        $this->resumeService->returnToModeration($resume);

        return redirect('/profile')->with('success', 'Резюме обновлено и отправлено на модерацию.');
    }

    public function destroy($id)
    {
        $resume = UserResume::findOrFail($id);

        if ($resume->user_id !== Auth::id()) {
            abort(403);
        }

        $resume->delete();
        return redirect('/profile');
    }

    public function download(int $id)
    {
        // The resume PDF is opened as a plain link (no X-Locale header), so a
        // request without a `locale` cookie falls back to the app default `en`,
        // which has no lang/en/messages.php. That would render the enum labels
        // (education level, employment type, work schedule, driving licence) as
        // raw keys like "messages.resume.education_level.higher". Pin to a
        // supported content locale so the labels are always translated.
        if (! in_array(app()->getLocale(), ['ru', 'kk'], true)) {
            app()->setLocale('ru');
        }

        $resume = UserResume::find($id);

        if(!$resume){
            return Inertia::render('NotFound');
        }

        $isOwner = $resume->user_id === Auth::id();

        if (! $resume->isPublished() && ! $isOwner && ! request()->hasValidSignature()) {
            return Inertia::render('NotFound');
        }

        $canViewContacts = $this->canAuthenticatedUserViewResumeContact($resume)
            || request()->hasValidSignature();

        $experience = [];
        if ($resume->organizations) {
            foreach ($resume->organizations as $organization) {
                $experience[] = [
                    'title'            => $organization->position,
                    'company'          => $organization->organization,
                    'period'           => trim(str_replace(['until_now', 'undefined'], __('messages.resume.pdf.until_now'), (string) $organization->period), " -"),
                    'responsibilities' => $organization->responsibilities
                ];
            }
        }

        $user = $resume->user;

        $data = [
            'name'                  => $user->name,
            'photo'                 => $this->resolveAvatarDataUri($user->image_url),
            'logo'                  => $this->embedImageFile(public_path('images/logo2.png')),
            'position'              => $resume->position,
            'employment_type'       => $resume->employment_type,
            'work_schedule'         => $resume->work_schedule,
            'salary'                => $resume->formatted_salary ? $resume->formatted_salary . ' ₸' : '',
            'address'               => $resume->city . ($resume->city == 'Астана' ? ', район ' . $resume->district : ''),
            'age'                   => $user->age,
            'born'                  => $user->born,
            'email'                 => $canViewContacts ? ($user->email ?? '') : '',
            'phone'                 => $canViewContacts && $user->phone ? '+' . $user->phone : '',
            'is_graduate'           => (bool) $user->is_graduate,
            'experience'            => $experience,
            'education'             => [
                'education_level' => $resume->education_level,
                'degree'          => $resume->faculty,
                'institution'     => $resume->educational_institution,
                'period'          => $resume->graduation_year,
            ],
            'languages'             => $resume->languages ? $resume->languages->pluck('language')->join(', ') : '',
            'skills'                => $resume->skills,
            'ip_status'             => (bool) $resume->ip_status,
            'has_car'               => (bool) $resume->has_car,
            'driving_license_title' => $resume->driving_license_title,
            'about'                 => $resume->about,
        ];

        $html = view('pdf.resume', $data)->render();

        $pdf = Pdf::loadHTML($html);
        $pdf->render();
        $this->drawPdfFooter($pdf);

        return $pdf->download('resume.pdf');
    }

    /**
     * Draw the "jumystap.kz  ·  N / M" footer on every page via the DomPDF
     * canvas. Done here (not in Blade) because counter(pages) renders as 0 in
     * this DomPDF build. Failures never break the download.
     */
    private function drawPdfFooter($pdf): void
    {
        try {
            $dompdf      = $pdf->getDomPDF();
            $canvas      = $dompdf->getCanvas();
            $fontMetrics = $dompdf->getFontMetrics();
            $font        = $fontMetrics->getFont('DejaVu Sans', 'normal');

            if (! $font) {
                return;
            }

            $size   = 9;
            $color  = [0.61, 0.64, 0.69]; // #9CA3AF
            $margin = 42;                 // ~56px content inset in points (matches .page padding)
            $y      = $canvas->get_height() - 30;

            $canvas->page_text($margin, $y, 'jumystap.kz', $font, $size, $color);

            $label      = '{PAGE_NUM} / {PAGE_COUNT}';
            $labelWidth = $fontMetrics->getTextWidth('00 / 00', $font, $size);
            $canvas->page_text($canvas->get_width() - $margin - $labelWidth, $y, $label, $font, $size, $color);
        } catch (\Throwable $e) {
            // Footer is cosmetic — never fail the PDF download over it.
        }
    }

    /**
     * Resolve a user avatar (stored as an "image_url" like "/avatars/x.jpg", a
     * public-disk path, or a remote URL) into a base64 data URI DomPDF can
     * embed. Returns null when the image can't be read, so the PDF cleanly
     * falls back to the photo-less layout.
     */
    private function resolveAvatarDataUri(?string $imageUrl): ?string
    {
        if (empty($imageUrl)) {
            return null;
        }

        if (str_starts_with($imageUrl, 'http://') || str_starts_with($imageUrl, 'https://')) {
            try {
                $bytes = @file_get_contents($imageUrl);
            } catch (\Throwable $e) {
                $bytes = false;
            }

            return $bytes ? $this->bytesToDataUri($bytes) : null;
        }

        $relative = ltrim($imageUrl, '/');

        foreach ([
            public_path($relative),
            storage_path('app/public/' . $relative),
            public_path('storage/' . $relative),
        ] as $candidate) {
            if (is_file($candidate) && is_readable($candidate)) {
                return $this->embedImageFile($candidate);
            }
        }

        return null;
    }

    private function embedImageFile(string $absolutePath): ?string
    {
        if (! is_file($absolutePath) || ! is_readable($absolutePath)) {
            return null;
        }

        return $this->bytesToDataUri(file_get_contents($absolutePath));
    }

    private function bytesToDataUri(string $bytes): ?string
    {
        if ($bytes === '') {
            return null;
        }

        $info = @getimagesizefromstring($bytes);
        $mime = $info['mime'] ?? 'image/png';

        return 'data:' . $mime . ';base64,' . base64_encode($bytes);
    }

}
