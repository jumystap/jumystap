<?php

namespace App\Http\Controllers\Admin;

use App\Models\Announcement;
use App\Http\Controllers\Controller;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $query = Announcement::query();
        if($userId = $request->input('user_id')){
            $query->where('user_id', $userId);
        }
        return view('admin.announcements.index')
            ->with('announcements', $query->whereNotIn('id', [1])->latest()->paginate(100)->appends(request()->query()));
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
