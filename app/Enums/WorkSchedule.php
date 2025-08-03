<?php

namespace App\Enums;

enum WorkSchedule: string
{
    case FULL_DAY = 'full_day';
    case SHIFT = 'shift';
    case FLEXIBLE = 'flexible';
    case REMOTE = 'remote';
    case ROTATIONAL = 'rotational';

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
