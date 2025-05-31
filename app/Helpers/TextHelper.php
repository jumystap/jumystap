<?php

namespace App\Helpers;

class TextHelper
{
    public static function numberFormat(int $number): string
    {
        return number_format($number, 0, '', ' ');
    }
}
