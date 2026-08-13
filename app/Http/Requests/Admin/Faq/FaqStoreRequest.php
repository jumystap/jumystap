<?php

namespace App\Http\Requests\Admin\Faq;

use Illuminate\Foundation\Http\FormRequest;

class FaqStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_ru' => 'required|string|max:255',
            'question_kz' => 'required|string|max:255',
            'answer_ru' => 'required|string',
            'answer_kz' => 'required|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }

    public function attributes(): array
    {
        return [
            'question_ru' => 'Вопрос (рус)',
            'question_kz' => 'Вопрос (каз)',
            'answer_ru' => 'Ответ (рус)',
            'answer_kz' => 'Ответ (каз)',
        ];
    }
}
