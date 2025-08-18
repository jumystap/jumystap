<?php

namespace App\Enums;

enum EmploymentType: int
{
    case FULL_TIME = 1;
    case PART_TIME = 2;
    case TEMPORARY = 3;
    case CONTRACT = 4;

    /**
     * Человекочитаемые названия (можно вынести в lang)
     */
    public function label(): string
    {
        return match ($this) {
            self::FULL_TIME => 'Полная занятость',
            self::PART_TIME => 'Частичная занятость',
            self::TEMPORARY => 'Подработка',
            self::CONTRACT => 'Проектная работа',
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
