<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Certificate\CertificateStoreRequest;
use App\Models\Certificate;
use App\Models\Profession\Profession;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class CertificateController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!$search) {
            $search = [
                'profession_id' => null,
                'phone'         => null,
                'start_date'    => null,
                'end_date'      => null,
            ];
        }

        return view('admin.certificates.index')
            ->with('certificates', Certificate::search($search)->latest()->paginate(100)->appends(request()->query()))
            ->with('professions', Profession::all())
            ->with('search', $search);
    }

    public function create()
    {
        return view('admin.certificates.create')
            ->with('professions', Profession::all());
    }

    public function store(CertificateStoreRequest $request)
    {
        $certificate = Certificate::create($request->validated());

        throw_unless($certificate, new BadRequestException(__('Ошибка при создании Сертификата')));

        session()->flash('success', __('Сертификат успешно создан'));

        return redirect()->route('admin.certificates.index');
    }

}

