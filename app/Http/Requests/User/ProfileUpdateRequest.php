<?php

namespace App\Http\Requests\User;

use App\Enums\Roles;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize()
    {
        // Authorize the request (e.g., check if user is allowed to update)
        return true; // Adjust based on your authorization logic
    }

    public function rules(): array
    {
        $sixteenYearsAgo = Carbon::today()->subYears(16)->format('d.m.Y');

        $rules = [
            'role_id'               => ['required', Rule::enum(Roles::class)->only([Roles::EMPLOYER, Roles::EMPLOYEE, Roles::COMPANY])],
            'avatar'                => 'nullable|file|max:2048',
            'name'                  => 'required|string|max:255',
            'email'                 => ['required', 'email', 'max:255', 'unique:users,email,' . $this->user()->id],
            'password'              => 'nullable|string|min:8|confirmed',
            'password_confirmation' => 'nullable',
        ];
        if ((int)request('role_id') === Roles::EMPLOYEE->value) {
            $additional = [
                'ipStatus1'     => 'nullable|string',
                'ipStatus2'     => 'nullable|string',
                'ipStatus3'     => 'nullable|string',
                'date_of_birth' => [
                    'required',
                    'date',
                    'before:' . $sixteenYearsAgo,
                ],
            ];
        } else {
            $additional = [
                'description' => 'required|string|max:3000|min:100',
            ];
        }

        return array_merge($rules, $additional);
    }
}
