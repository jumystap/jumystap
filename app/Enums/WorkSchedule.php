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
            self::FULL_DAY => __('messages.work_schedule.full_day'),
            self::SHIFT => __('messages.work_schedule.shift'),
            self::FLEXIBLE => __('messages.work_schedule.flexible'),
            self::REMOTE => __('messages.work_schedule.remote'),
            self::ROTATIONAL => __('messages.work_schedule.rotational')
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
