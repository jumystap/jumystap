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
     * Адрес раньше приходил массивом строк, теперь — массивом объектов
     * с координатами. Приводим строки к общему виду, чтобы старые клиенты
     * продолжали работать.
     */
    protected function prepareForValidation(): void
    {
        $locations = $this->input('location');

        if (is_array($locations)) {
            $this->merge([
                'location' => array_map(
                    fn ($location) => is_array($location) ? $location : ['adress' => $location],
                    $locations
                ),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        $rules = [
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
            'location' => 'required|array',
            'location.*.adress' => 'required|string|max:255',
            'location.*.latitude' => 'nullable|numeric|between:-90,90',
            'location.*.longitude' => 'nullable|numeric|between:-180,180',
            'city' => 'nullable|string|max:255',
            'specialization_id' => 'nullable',
            'salary_type' => 'required',
            'cost_min' => 'nullable|numeric',
            'cost_max' => 'nullable|numeric',
            'responsibility' => 'required|array', // Single cohesive block, required
            'responsibility.*' => 'required|string|max:1000',
            'requirement' => 'required|array', // Single cohesive block, required
            'requirement.*' => 'required|string|max:1000',
            'condition' => 'required|array', // Single cohesive block, required
            'condition.*' => 'required|string|max:1000',
            'phone' => 'nullable|digits:11',
        ];

        // Адрес не нужен ни при удалённом графике, ни когда город выбран
        // «Дистанционное» — в обоих случаях форма его не показывает.
        if (request('work_time') === 'Удаленная работа' || request('city') === 'Дистанционное') {
            return array_merge($rules, [
                'location' => 'nullable|array',
                'location.*.adress' => 'nullable|string|max:255',
            ]);
        }

        return $rules;
    }
}
