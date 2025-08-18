<?php

namespace App\Enums;

enum WorkSchedule: int
{
    case FULL_DAY = 1;
    case SHIFT = 2;
    case FLEXIBLE = 3;
    case REMOTE = 4;
    case ROTATIONAL = 5;

    /**
     * Человекочитаемые названия (можно вынести в lang)
     */
    public function label(): string
    {
        return match ($this) {
            self::FULL_DAY => 'Полный день',
            self::SHIFT => 'Сменный график',
            self::FLEXIBLE => 'Гибкий график',
            self::REMOTE => 'Удаленная работа',
            self::ROTATIONAL => 'Вахта',
        };
    }

    /**
     * Список для <select>
     */
    public static function options(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[$case->value] = $case->label();
        }
        return $options;
    }
}
