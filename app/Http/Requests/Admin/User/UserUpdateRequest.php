<?php

namespace App\Http\Requests\Admin\User;

use App\Enums\Roles;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UserUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $user = Auth::user();
        if ($user->hasRole(Roles::ADMIN)) {
            return [
                'name' => 'required|max:255',
                'phone' => 'required|max:16|unique:users,phone,' . $this->user->id,
                'email' => 'required|email|unique:users,email,' . $this->user->id,
                'password' => 'nullable|string|min:8|confirmed',
                'description' => 'nullable|max:3000',
                'is_blocked' => 'nullable',
            ];
        } else {
            return [
                'phone' => 'required|max:16|unique:users,phone,' . $this->user->id,
            ];
        }
    }

    /**
     * @return array
     */
    public function attributes()
    {
        return [
            'name' => sprintf('«%s»', trans('ФИО')),
            'email' => sprintf('«%s»', trans('Почта')),
            'password' => sprintf('«%s»', trans('Пароль')),
        ];
    }
}
