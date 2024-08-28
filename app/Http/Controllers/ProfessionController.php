<?php

namespace App\Http\Controllers;

use App\Models\Profession\GroupProfession;
use App\Models\Profession\Profession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfessionController extends Controller
{
    public function index(string $group): mixed
    {
        $groups = GroupProfession::where('name', $group)->first();
        $professions = Profession::where('group_id', $groups->id)
            ->with([
                'skills',
                'images',
                'teachers.skills',
                'equipments.details',
                'equipments.images'
            ])
            ->get();

        return Inertia::render('Profession', [
            "professions" => $professions,
        ]);
    }
}
