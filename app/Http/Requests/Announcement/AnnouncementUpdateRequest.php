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
     * Страница редактирования шлёт адреса объектами, но часть клиентов ещё
     * может прислать массив строк — приводим к единому виду.
     */
    protected function prepareForValidation(): void
    {
        $locations = $this->input('location');

        if (is_array($locations)) {
            $this->merge([
                'location' => array_map(function ($location) {
                    $location = is_array($location) ? $location : ['adress' => $location];
                    // required_if сравнивает со значением поля, поэтому флаг
                    // должен быть настоящим boolean, а не отсутствовать.
                    $location['without_point'] = filter_var(
                        $location['without_point'] ?? false,
                        FILTER_VALIDATE_BOOLEAN
                    );

                    return $location;
                }, $locations),
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
            'description' => 'nullable|string',
            'payment_type' => 'required|string|max:255',
            'cost' => 'required_if:salary_type,exact|nullable|numeric',
            'status' => 'required|int',
            'work_time' => 'nullable|string|max:255', // Assuming work_time is a string
            'work_hours' => 'nullable|max:255',
            'employment_type' => 'nullable',
            'experience' => 'nullable',
            'location' => 'required|array',
            'location.*.id' => 'nullable|integer',
            'location.*.adress' => 'required|string|max:255',
            // Координаты обязательны: адрес без точки не попадёт на карту.
            // Исключение — строки, помеченные фронтом как «точки не бывает»
            // (охватные формулировки вроде «более 30 филиалов»).
            'location.*.without_point' => 'nullable|boolean',
            'location.*.latitude' => 'required_if:location.*.without_point,false|nullable|numeric|between:-90,90',
            'location.*.longitude' => 'required_if:location.*.without_point,false|nullable|numeric|between:-180,180',
            'city' => 'nullable|string|max:255',
            'specialization_id' => 'nullable|integer', // Assuming this is an integer
            'salary_type' => 'required|string|max:255',
            'cost_min' => 'nullable|numeric',
            'cost_max' => 'nullable|numeric',
            'responsibility' => 'required|array', // Single cohesive block, required
            'responsibility.*.responsibility' => 'required|string|max:1000',
            'requirement' => 'required|array', // Single cohesive block, required
            'requirement.*.requirement' => 'required|string|max:1000',
            'condition' => 'required|array', // Single cohesive block, required
            'condition.*.condition' => 'required|string|max:1000',
            'is_top' => 'nullable|boolean',
            'is_urgent' => 'nullable|boolean',
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
