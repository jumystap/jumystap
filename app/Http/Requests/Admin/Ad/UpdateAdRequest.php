<?php

namespace App\Http\Requests\Admin\Ad;

class UpdateAdRequest extends StoreAdRequest
{
    public function rules(): array
    {
        $rules = parent::rules();

        $rules['photos'] = 'nullable|array|max:3';

        // Комментарий при изменении статуса
        $rules['status_comment'] = 'nullable|string|max:500';

        return $rules;
    }
}

