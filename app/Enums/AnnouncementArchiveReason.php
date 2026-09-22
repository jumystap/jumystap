<?php

namespace App\Enums;

enum AnnouncementArchiveReason: int
{
    case FOUND_ON_SITE = 1;
    case FOUND_OTHER_PLATFORM = 2;
    case NO_LONGER_RELEVANT = 3;

    public function getLabel(): string
    {
        return self::labels()[$this->value];
    }

    /**
     * Stable i18n key, mirrors the frontend locale keys (FOUND_ON_SITE -> found_on_site).
     */
    public function key(): string
    {
        return strtolower($this->name);
    }

    /**
     * Options for the archive modal: numeric value + i18n key (translated on the frontend).
     *
     * @return array<int, array{value: int, key: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn ($case) => ['value' => $case->value, 'key' => $case->key()],
            self::cases(),
        );
    }

    public static function labels(): array
    {
        return [
            self::FOUND_ON_SITE->value => 'Нашёл сотрудника через наш сайт',
            self::FOUND_OTHER_PLATFORM->value => 'Нашёл через другую площадку',
            self::NO_LONGER_RELEVANT->value => 'Вакансия больше не актуальна',
        ];
    }

    public static function list(): array
    {
        return array_combine(
            array_map(fn ($case) => $case->value, self::cases()),
            array_map(fn ($case) => $case->getLabel(), self::cases()),
        );
    }
}
