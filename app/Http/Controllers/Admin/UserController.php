<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\User\UserStoreRequest;
use App\Http\Requests\Admin\User\UserUpdateRequest;
use App\Models\Role;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Illuminate\Support\Facades\Hash;
use Throwable;

class UserController extends Controller
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
                'name'    => null,
                'phone'   => null,
                'email'   => null,
                'role_id' => null,
            ];
        }

        Session::put('users_url', request()->fullUrl());

        return view('admin.users.index')
            ->with('users', User::search($search)->whereNotIn('id', [1])->latest()->paginate(100)->appends(request()->query()))
            ->with('roles', Role::all())
            ->with('search', $search);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Application|Factory|View
     */
    public function create()
    {
        return view('admin.users.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UserStoreRequest $request
     * @return RedirectResponse
     * @throws Throwable
     */
    public function store(UserStoreRequest $request): RedirectResponse
    {
        $input             = $request->validated();
        $input['password'] = Hash::make($input['password']);

        $user = User::query()->create($input);

        throw_unless($user, new BadRequestException(__('Ошибка при создании Пользователя')));

        session()->flash('success', __('Пользователь успешно создан'));

        return redirect()->route('admin.users.index');
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     * @return Response
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param User $user
     * @return Application|Factory|View
     */
    public function edit(User $user)
    {
        return view('admin.users.edit', compact('user'))
            ->with('roles', Role::all());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UserUpdateRequest $request
     * @param User $user
     * @return Application|RedirectResponse|Redirector
     * @throws Throwable
     */
    public function update(UserUpdateRequest $request, User $user): Application|Redirector|RedirectResponse
    {
        if ($request->isNotFilled('password')) {
            $input = $request->only('name', 'email', 'description');
        } else {
            $input             = $request->validated();
            $input['password'] = Hash::make($input['password']);
        }
        $input['is_blocked'] = $request->has('is_blocked') ? 1 : 0;
        $updated = $user->update($input);

        throw_unless($updated, new BadRequestException(__('Ошибка при редактировании Пользователя')));

        session()->flash('success', __('Пользователь успешно отредактирован'));

        if ($usersUrl = session('users_url')) {
            return redirect($usersUrl);
        }

        return redirect()->route('admin.users.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return RedirectResponse
     * @throws Throwable
     */
    public function destroy(User $user)
    {
        $deleted = $user->delete();
        throw_unless($deleted, new BadRequestException(__('Ошибка при удалении Пользователя')));

        session()->flash('success', __('Пользователь успешно удален'));

        return redirect()->route('admin.users.index');
    }
}
