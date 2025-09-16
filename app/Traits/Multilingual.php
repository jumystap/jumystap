<?php

namespace App\Traits;

trait Multilingual
{
    public function getAttribute($key)
    {
        $locale = app()->getLocale();
        $locale = $locale === 'kk' ? 'kz' : $locale;

        if(str_contains($key, '_ru')){
            $key = str_replace('_ru', '', $key);
            $locale = 'ru';
        }

        $attribute = $key . '_' . $locale;
        if (array_key_exists($attribute, $this->getAttributes()))
            return parent::getAttribute($attribute);

        return parent::getAttribute($key);
    }
}
