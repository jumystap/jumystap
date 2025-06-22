<?php

namespace App\Http\Requests\Announcement;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AnnouncementCreateRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'type_kz' => 'required|string|max:255',
            'type_ru' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable',
            'payment_type' => 'required|string|max:255',
            'cost' => 'required_if:salary_type,exact|nullable|numeric',
            'status' => 'required|int',
            'work_time' => 'nullable',
            'work_hours' => 'nullable|max:255',
            'employment_type' => 'nullable',
            'experience' => 'nullable',
            'education' => 'nullable',
            'location' => 'nullable|array', // Validate as an array
            'location.*' => 'string|max:255', // Validate each location item
            'city' => 'nullable|string|max:255',
            'specialization_id' => 'nullable',
            'salary_type' => 'required',
            'cost_min' => 'nullable|numeric',
            'cost_max' => 'nullable|numeric',
            'responsibility' => 'nullable|array', // Validate as an array
            'responsibility.*' => 'string|max:2000', // Validate each responsibility item
            'requirement' => 'nullable|array', // Validate as an array
            'requirement.*' => 'string|max:2000', // Validate each requirement item
            'condition' => 'nullable|array', // Validate as an array
            'condition.*' => 'string|max:2000', // Validate each requirement item
            'phone' => 'nullable|digits:11',
        ];
    }
}
