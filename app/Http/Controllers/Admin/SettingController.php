<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(): View
    {
        return view('admin.settings.index', [
            'maintenanceBanner' => Setting::getBool('maintenance_banner'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        Setting::set('maintenance_banner', $request->boolean('maintenance_banner') ? '1' : '0');

        return redirect()->back()->with('success', 'Настройки успешно сохранены');
    }
}
