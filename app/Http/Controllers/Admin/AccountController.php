<?php

namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\UserProfileRequest;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    /**
     * @return Application|Factory|View
     */
    public function index()
    {
        return view('admin.account.index');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UserProfileRequest $request
     * @return RedirectResponse
     */
    public function update(UserProfileRequest $request)
    {
        if($request->isNotFilled('password')){
            $input = $request->only('name', 'email');
        }else{
            $input = $request->all();
            $input['password'] = Hash::make($input['password']);
        }

        $user = Auth::user();
        $user->update($input);

        return redirect()->back()->with('success', 'Профиль успешно обновлен!');
    }
}
