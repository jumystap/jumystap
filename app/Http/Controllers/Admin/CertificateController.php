<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profession\Profession;
use App\Models\UserProfession;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!$search) {
            $search = [
                'profession_id'      => null,
                'phone'              => null,
                'name'               => null,
                'certificate_number' => null,
                'start_date'         => null,
                'end_date'           => null,
                'is_graduate'        => null,
            ];
        }

        return view('admin.certificates.index')
            ->with('certificates', UserProfession::search($search)->orderBy('user_professions.id', 'DESC')->paginate(100)->appends(request()->query()))
            ->with('professions', Profession::all())
            ->with('search', $search);
    }
}

