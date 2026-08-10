<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Faq\FaqStoreRequest;
use App\Http\Requests\Admin\Faq\FaqUpdateRequest;
use App\Models\Faq;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;

class FaqController extends Controller
{
    public function index(): View
    {
        return view('admin.faqs.index', [
            'faqs' => Faq::orderBy('sort_order')->orderBy('id')->paginate(50),
        ]);
    }

    public function create(): View
    {
        return view('admin.faqs.create');
    }

    public function store(FaqStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active');
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        Faq::create($validated);

        session()->flash('success', 'Вопрос успешно добавлен');

        return redirect()->route('admin.faqs.index');
    }

    public function edit(Faq $faq): View
    {
        return view('admin.faqs.edit', compact('faq'));
    }

    public function update(FaqUpdateRequest $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active');
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        $faq->update($validated);

        session()->flash('success', 'Вопрос успешно отредактирован');

        return redirect()->route('admin.faqs.index');
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();

        session()->flash('success', 'Вопрос успешно удалён');

        return redirect()->route('admin.faqs.index');
    }
}
