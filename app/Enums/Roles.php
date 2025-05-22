<?php

namespace App\Enums;
enum Roles : int
{
    case EMPLOYER = 1;
    case EMPLOYEE = 2;
    case COMPANY = 3;
    case ADMIN = 4;
    case MODERATOR = 5;
}
