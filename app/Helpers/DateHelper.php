<?php

namespace App\Helpers;

class DateHelper
{
    public static function calculateAge(string $born): int
    {
        $bornTime = strtotime($born);
        $age      = date('Y') - date('Y', $bornTime);

        if (date('md', $bornTime) > date('md')) {
            $age--;
        }

        return $age;
    }
}
