<?php

namespace App\Enums;

enum AnnouncementStatus: int
{
    case ON_MODERATION = 0;
    case ACTIVE = 1;
    case BLOCKED = 2;
    case ARCHIVED = 3;

    public function getLabel(): string
    {
        return self::labels()[$this->value];
    }

    public static function labels(): array
    {
        return [
            self::ON_MODERATION->value => 'На модерации',
            self::ACTIVE->value => 'Активный',
            self::BLOCKED->value => 'Заблокировано',
            self::ARCHIVED->value => 'Архивировано',
        ];
    }
    public function getClass(): string
    {
        return self::classes()[$this->value];
    }

    public static function classes(): array
    {
        return [
            self::ON_MODERATION->value => 'warning',
            self::ACTIVE->value => 'success',
            self::BLOCKED->value => 'danger',
            self::ARCHIVED->value => 'secondary',
        ];
    }


    public static function list(): array
    {
        return array_combine(
            array_map(fn($case) => $case->value, self::cases()),
            array_map(fn($case) => $case->label(), self::cases()),
        );
    }
}
