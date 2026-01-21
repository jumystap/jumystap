<?php

namespace App\Traits;

trait Multilingual
{
    /**
     * Supported locales mapping
     */
    protected function getLocaleMap(): array
    {
        return [
            'kk' => 'kz',
            'ru' => 'ru',
            'en' => 'en',
        ];
    }

    /**
     * Get the normalized locale
     */
    protected function getNormalizedLocale(): string
    {
        $locale = app()->getLocale();
        $localeMap = $this->getLocaleMap();

        return $localeMap[$locale] ?? $locale;
    }

    /**
     * Check if attribute has a locale suffix and extract it
     */
    protected function extractLocaleFromKey(string $key): array
    {
        foreach ($this->getLocaleMap() as $locale) {
            $suffix = "_{$locale}";
            if (str_ends_with($key, $suffix)) {
                return [
                    'base_key' => substr($key, 0, -strlen($suffix)),
                    'locale' => $locale,
                    'forced' => true
                ];
            }
        }

        return [
            'base_key' => $key,
            'locale' => $this->getNormalizedLocale(),
            'forced' => false
        ];
    }

    /**
     * Get attribute with multilingual support
     */
    public function getAttribute($key)
    {
        // Extract locale information from key
        $localeInfo = $this->extractLocaleFromKey($key);

        // Build the localized attribute name
        $localizedKey = $localeInfo['base_key'] . '_' . $localeInfo['locale'];

        // Check if localized attribute exists
        if (array_key_exists($localizedKey, $this->getAttributes())) {
            return parent::getAttribute($localizedKey);
        }

        // Fallback to original key
        return parent::getAttribute($key);
    }

    /**
     * Get attribute in specific locale
     */
    public function getTranslation(string $attribute, string $locale): mixed
    {
        $locale = $this->getLocaleMap()[$locale] ?? $locale;
        $localizedKey = "{$attribute}_{$locale}";

        if (array_key_exists($localizedKey, $this->getAttributes())) {
            return parent::getAttribute($localizedKey);
        }

        return null;
    }

    /**
     * Get all translations for an attribute
     */
    public function getTranslations(string $attribute): array
    {
        $translations = [];

        foreach ($this->getLocaleMap() as $locale) {
            $localizedKey = "{$attribute}_{$locale}";
            if (array_key_exists($localizedKey, $this->getAttributes())) {
                $translations[$locale] = parent::getAttribute($localizedKey);
            }
        }

        return $translations;
    }

    /**
     * Check if attribute has translation in given locale
     */
    public function hasTranslation(string $attribute, string $locale): bool
    {
        $locale = $this->getLocaleMap()[$locale] ?? $locale;
        $localizedKey = "{$attribute}_{$locale}";

        return array_key_exists($localizedKey, $this->getAttributes());
    }
}
