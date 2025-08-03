<?php

namespace App\Enums;

enum EmploymentType: string
{
    case FULL_TIME = 'full_time';
    case PART_TIME = 'part_time';
    case TEMPORARY = 'temporary';
    case CONTRACT = 'contract';

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
