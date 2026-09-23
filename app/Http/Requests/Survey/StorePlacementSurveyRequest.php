<?php

namespace App\Http\Requests\Survey;

use Illuminate\Foundation\Http\FormRequest;

class StorePlacementSurveyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => is_string($this->name) ? trim($this->name) : $this->name,
            'phone' => is_string($this->phone) ? trim($this->phone) : $this->phone,
            'position' => is_string($this->position) ? trim($this->position) : $this->position,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:100'],
            'position' => ['required', 'string', 'max:100'],
            'is_graduate' => ['required', 'boolean'],
            'consent' => ['required', 'accepted'],
        ];
    }
}
