<?php

namespace App\Http\Requests\Announcement;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AnnouncementUpdateRequest extends FormRequest
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
            'description' => 'nullable|string',
            'payment_type' => 'required|string|max:255',
            'cost' => 'required_if:salary_type,exact|nullable|numeric',
            'status' => 'required|int',
            'work_time' => 'nullable|string|max:255', // Assuming work_time is a string
            'work_hours' => 'nullable|max:255',
            'employment_type' => 'nullable',
            'experience' => 'nullable',
            'location' => 'required|array',
            'location.*.id' => 'nullable|integer', // Ensure each location has an id
            'location.*.adress' => 'required|string|max:255', // Ensure each location has an address
            'city' => 'nullable|string|max:255',
            'specialization_id' => 'nullable|integer', // Assuming this is an integer
            'salary_type' => 'required|string|max:255',
            'cost_min' => 'nullable|numeric',
            'cost_max' => 'nullable|numeric',
            'responsibility' => 'nullable|array',
            'responsibility.*.id' => 'required|integer', // Ensure each responsibility has an id
            'responsibility.*.responsibility' => 'required|string|max:2000', // Ensure each responsibility has a description
            'requirement' => 'nullable|array',
            'requirement.*.id' => 'required|integer', // Ensure each requirement has an id
            'requirement.*.requirement' => 'required|string|max:2000', // Ensure each requirement has a description
            'condition' => 'nullable|array',
            'condition.*.id' => 'required|integer', // Ensure each condition has an id
            'condition.*.condition' => 'required|string|max:2000', // Ensure each condition has a description
            'is_top' => "nullable|boolean",
            'is_urgent' => "nullable|boolean",
            'phone' => "nullable|digits:11",
        ];
    }
}
