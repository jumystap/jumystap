<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Code;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class CodeController extends Controller
{
    public function index(Request $request): View
    {
        $search = $request->get('search', [
            'channel'  => null,
            'receiver' => null,
            'code'     => null,
            'type'     => null,
        ]);

        $codes = Code::query()
            ->when($search['channel'] ?? null, fn ($q, $value) => $q->where('channel', $value))
            ->when($search['receiver'] ?? null, fn ($q, $value) => $q->where('receiver', 'like', "%{$value}%"))
            ->when($search['code'] ?? null, fn ($q, $value) => $q->where('code', 'like', "%{$value}%"))
            ->when($search['type'] ?? null, fn ($q, $value) => $q->where('type', 'like', "%{$value}%"))
            ->latest()
            ->paginate(100)
            ->appends($request->query());

        return view('admin.codes.index')
            ->with('codes', $codes)
            ->with('search', $search);
    }
}
