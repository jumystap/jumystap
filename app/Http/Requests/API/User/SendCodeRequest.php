<?php

namespace App\Http\Requests\API\User;


use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;

class SendCodeRequest extends FormRequest
{
    /**
     * @return bool
     */
    public function expectsJson(): bool
    {
        return true;
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
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
            'channel'  => 'required|in:1,2',
            'receiver' => 'required',
            'type'     => 'required|in:register,forgot',
        ];
    }

    /**
     * @param Validator $validator
     * @throws ValidationException
     */
    protected function failedValidation(Validator $validator)
    {
        if ($this->expectsJson()) {
            $errors = (new ValidationException($validator))->errors();
            throw new HttpResponseException(
                response()->json(['success' => false, 'messages' => __('validation.invalid_data'), 'errors' => $errors], 422)
            );
        }

        parent::failedValidation($validator);
    }
}
