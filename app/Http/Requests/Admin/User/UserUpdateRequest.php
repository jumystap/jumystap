<?php

namespace App\Http\Requests\Admin\User;

use Illuminate\Foundation\Http\FormRequest;

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
        return [
            'name' => "required|max:255",
            'email' => 'required|email|unique:users,email,'.$this->user->id,
            'password' => "nullable|string|min:8|confirmed",
            'role' => "required",
        ];
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
