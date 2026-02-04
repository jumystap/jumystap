<?php

namespace App\Http\Requests\Admin\Ad;

use App\Enums\AdStatus;
use App\Enums\AdType;
use App\Enums\PriceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'type' => ['required', new Enum(AdType::class)],
            'title' => 'required|string|max:80',
            'description' => 'required|string|min:50|max:1000',
            'category_id' => 'required|exists:professions,id',
            'subcategory_id' => 'nullable|exists:professions,id',
            'city_id' => 'required|exists:cities,id',
            'address' => 'nullable|string|max:255',
            'is_remote' => 'boolean',

            'price_type' => ['required', new Enum(PriceType::class)],
            'price_exact' => 'required_if:price_type,exact|nullable|numeric|min:0',
            'price_from' => 'required_if:price_type,range|nullable|numeric|min:0',
            'price_to' => 'required_if:price_type,range|nullable|numeric|min:0|gt:price_from',

            'use_profile_phone' => ['nullable', 'boolean'],
            'phone' => ['required_unless:use_profile_phone,1', 'nullable', 'string', 'max:20'],

            'business_type_id' => 'nullable|exists:business_types,id',

            'status' => ['nullable', new Enum(AdStatus::class)],

            'photos' => 'required|array|max:3',
            'photos.*' => 'image|mimes:jpeg,jpg,png,webp|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'title.max' => 'Название не должно превышать 80 символов',
            'description.min' => 'Описание должно содержать минимум 100 символов',
            'description.max' => 'Описание не должно превышать 1000 символов',
            'photos.max' => 'Можно загрузить максимум 3 фотографии',
            'photos.*.max' => 'Размер фотографии не должен превышать 5 МБ',
            'price_to.gt' => 'Максимальная цена должна быть больше минимальной',
            'phone.required_unless' => 'Поле Телефон обязательно для заполнения, когда Использовать профиль в Телефоне не выбран.',
        ];
    }
}

