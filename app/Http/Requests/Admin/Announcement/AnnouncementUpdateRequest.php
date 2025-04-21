<?php

namespace App\Http\Requests\Admin\Announcement;

use Illuminate\Foundation\Http\FormRequest;

class AnnouncementUpdateRequest extends FormRequest
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
            'title' => "required|max:255",
            'status' => 'required|int',
            'publish' => 'nullable',
        ];
    }

    /**
     * @return array
     */
    public function attributes()
    {
        return [
            'title' => sprintf('«%s»', trans('Наименование')),
            'status' => sprintf('«%s»', trans('Статус')),
        ];
    }
}
