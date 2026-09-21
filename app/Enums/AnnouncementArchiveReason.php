<?php

namespace App\Enums;

enum AnnouncementArchiveReason: string
{
    case FOUND_ON_SITE = 'found_on_site';
    case FOUND_OTHER_PLATFORM = 'found_other_platform';
    case NO_LONGER_RELEVANT = 'no_longer_relevant';

    public function getLabel(): string
    {
        return self::labels()[$this->value];
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
