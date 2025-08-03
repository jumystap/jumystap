<?php

namespace App\Enums;

enum DrivingLicenseCategory: string
{
    case NONE = 'none';
    case A = 'A';
    case B = 'B';
    case C = 'C';
    case D = 'D';
    case BE = 'BE';
    case CE = 'CE';
    case DE = 'DE';
    case TM = 'Tm';
    case TB = 'Tb';

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
