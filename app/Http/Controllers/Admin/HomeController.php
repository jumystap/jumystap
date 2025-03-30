<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;

class HomeController extends Controller
{
    public function index(): Factory|View|Application
    {
        $data = [
            [
                'title' => 'Пользователей',
                'link' => route('admin.users.index'),
                'icon' => 'fas fa-user',
                'bg' => 'bg-danger',
                'count' => User::all()->count()
            ],
        ];

        session()->flash('success', __('Страница успешно загружена!'));
        return view('admin.home', compact('data'));
    }

}
