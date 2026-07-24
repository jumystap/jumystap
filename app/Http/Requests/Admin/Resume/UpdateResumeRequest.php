<?php

namespace App\Http\Requests\Admin\Resume;

use App\Enums\ResumeStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateResumeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'position'                => 'required|string|max:100',
            'email'                   => 'nullable|email',
            'phone'                   => 'required|string|max:20',
            'city'                    => 'required|string',
            'district'                => 'nullable|string',
            'salary'                  => 'nullable|numeric',
            'employment_type_id'      => 'nullable|integer',
            'work_schedule_id'        => 'nullable|integer',
            'education_level_id'      => 'nullable|integer',
            'educational_institution' => 'nullable|string',
            'faculty'                 => 'nullable|string',
            'graduation_year'         => 'nullable|integer',
            'ip_status'               => 'nullable|boolean',
            'has_car'                 => 'nullable|boolean',
            'driving_license'         => 'nullable|string',
            'skills'                  => 'nullable|array',
            'skills.*'                => 'nullable|string|max:255',
            'about'                   => 'required|string|max:10000',
            'status'                  => ['required', new Enum(ResumeStatus::class)],
            'status_comment'          => 'nullable|string|max:500',
        ];
    }
}
