<?php

namespace App\Enums;
enum Roles : int
{
    case EMPLOYER = 1;
    case EMPLOYEE = 2;
    case COMPANY = 3;
    case ADMIN = 4;
    case MODERATOR = 5;
    case NON_GRADUATE = 6;

    /**
     * Человекочитаемые названия
     */
    public function label(): string
    {
        return match ($this) {
            self::EMPLOYER => __('messages.roles.employer'),
            self::EMPLOYEE => __('messages.roles.employee'),
            self::COMPANY => __('messages.roles.company'),
            self::ADMIN => __('messages.roles.admin'),
            self::MODERATOR => __('messages.roles.moderator'),
            self::NON_GRADUATE => __('messages.roles.non_graduate'),
        };
    }

    /**
     * Список для <select>
     */
    public static function options(): array
    {
        $options = [];
        foreach ([self::EMPLOYER, self::EMPLOYEE, self::COMPANY] as $case) {
            $options[$case->value] = $case->label();
        }
        return $options;
    }
}
