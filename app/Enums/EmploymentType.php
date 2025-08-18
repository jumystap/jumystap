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
            self::FULL_TIME => __('messages.resume.employment_type.full_time'),
            self::PART_TIME => __('messages.resume.employment_type.part_time'),
            self::TEMPORARY => __('messages.resume.employment_type.temporary'),
            self::CONTRACT => __('messages.resume.employment_type.contract'),
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
