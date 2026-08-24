<?php

namespace App\Http\Requests\Feedback;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SendTelegramFeedbackRequest extends FormRequest
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
            'reason' => is_string($this->reason) ? trim($this->reason) : $this->reason,
        ]);
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:application,complaint'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'items' => ['required', 'array', 'min:1'],
            'items.*' => ['required', 'string', 'max:255'],
            'reason' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $items = $this->input('items', []);

                if (
                    $this->input('type') === 'application'
                    && is_array($items)
                    && collect($items)->every(static fn ($item): bool => is_string($item))
                    && mb_strlen(implode(', ', $items)) > 500
                ) {
                    $validator->errors()->add('items', __('validation.max.string', [
                        'attribute' => 'items',
                        'max' => 500,
                    ]));
                }
            },
        ];
    }
}
