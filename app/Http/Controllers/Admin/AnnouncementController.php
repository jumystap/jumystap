<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AnnouncementStatus;
use App\Enums\Roles;
use App\Http\Requests\Admin\Announcement\AnnouncementUpdateRequest;
use App\Models\Announcement;
use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Role;
use App\Models\SpecializationCategory;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Throwable;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Factory|View|Application
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!$search) {
            $search = [
                'city'                       => null,
                'specialization_category_id' => null,
                'no_experience'              => null,
                'with_salary'                => null,
                'type'                       => null,
                'company_name'               => null,
                'title'                      => null,
                'user_id'                      => null,
            ];
        }

        Session::put('announcements_url', request()->fullUrl());

        return view('admin.announcements.index')
            ->with('announcements', Announcement::search($search)->select('announcements.*')->orderBy('announcements.id', 'DESC')->paginate(100)->appends(request()->query()))
            ->with('roles', Role::query()->whereIn('id', [Roles::CUSTOMER->value, Roles::EMPLOYER->value])->get())
            ->with('specializationCategories', SpecializationCategory::all())
            ->with('cities', City::all())
            ->with('types', ['Вакансия', 'Заказ'])
            ->with('search', $search);
    }

    public function edit(Announcement $announcement)
    {
        return view('admin.announcements.edit', compact('announcement'))
            ->with('statuses', AnnouncementStatus::labels());
    }

    /**
     * @throws Throwable
     */
    public function update(AnnouncementUpdateRequest $request, Announcement $announcement): Application|Redirector|RedirectResponse
    {
        $validated = $request->validated();

        if((int)$validated['status'] === AnnouncementStatus::ACTIVE->value && (isset($validated['publish']) ||  $announcement->status != AnnouncementStatus::ACTIVE->value)) {
            $validated['published_at'] = now();
        }
        $updated = $announcement->update($validated);

        throw_unless($updated, new BadRequestException(__('Ошибка при редактировании Вакансии')));

        session()->flash('success', __('Вакансия успешно отредактирована'));

        if ($announcementUrl = session('announcements_url')) {
            return redirect($announcementUrl);
        }

        return redirect()->route('admin.users.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Announcement $announcement
     * @return RedirectResponse
     * @throws Throwable
     */
    public function destroy(Announcement $announcement)
    {
        $deleted = $announcement->delete();
        throw_unless($deleted, new BadRequestException(__('Ошибка при удалении Вакансии')));

        session()->flash('success', __('Вакансия успешно удалена'));

        return redirect()->route('admin.announcements.index');
    }
}
