<?php

namespace App\Enums;

enum DrivingLicenseCategory: int
{
    case NONE = 0;
    case A = 1;
    case B = 2;
    case C = 3;
    case D = 4;
    case BE = 5;
    case CE = 6;
    case DE = 7;
    case TM = 8;
    case TB = 9;

    /**
     * Человекочитаемые переводы (можно вынести в lang)
     */
    public function label(): string
    {
        return match($this) {
            self::NONE => 'Нет прав',
            self::A => 'Категория A',
            self::B => 'Категория B',
            self::C => 'Категория C',
            self::D => 'Категория D',
            self::BE => 'Категория BE',
            self::CE => 'Категория CE',
            self::DE => 'Категория DE',
            self::TM => 'Трамвай (Tm)',
            self::TB => 'Троллейбус (Tb)',
        };
    }

    /**
     * Получить список для <select>
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
