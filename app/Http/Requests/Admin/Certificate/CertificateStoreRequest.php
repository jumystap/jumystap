<?php

namespace App\Http\Requests\Admin\Certificate;

use Illuminate\Foundation\Http\FormRequest;

class CertificateStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
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
            'certificate_number' => 'required|unique:certificates,certificate_number',
            'profession_id' => 'required|exists:professions,id',
            'phone' => 'required|string',
        ];
    }

    /**
     * @return array
     */
    public function attributes()
    {
        return [
            'name' => sprintf('«%s»', trans('ФИО')),
            'email' => sprintf('«%s»', trans('Почта')),
        ];
    }
}
