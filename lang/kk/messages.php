<?php

return [
    'errors'        => [
        'incorrect_login_or_password' => 'Логин немесе құпия сөз қате. Қайталап көріңіз.',
        'account_is_blocked'          => 'Есептік жазбаңыз бұғатталған.'
    ],
    'announcements' => [
        'errors' => [
            'not_found'                 => 'Хабарландыру табылмады!',
            'does_not_access_to_view'   => 'Бұл хабарландыруды көруге рұқсатыңыз жоқ!',
            'does_not_access_to_update' => 'Сізде бұл хабарландыруды өзгертуге рұқсатыңыз жоқ!',
            'does_not_access_to_delete' => 'Сізде бұл хабарландыруды жоюға рұқсатыңыз жоқ!',
        ]
    ],
    'user'          => [
        'gender' => [
            'male'   => 'Еркек',
            'female' => 'Әйел',
        ]
    ],
    'resume'        => [
        'education_level'          => [
            "secondary"         => "Орта",
            "secondary_special" => "Арнайы орта",
            "incomplete_higher" => "Аяқталмаған жоғары білім",
            "higher"            => "Жоғары",
        ],
        'employment_type'          => [
            "full_time" => "Толық жұмыспен қамту",
            "part_time" => "Толық емес жұмыс күні",
            "temporary" => "Жарты күн жұмысы",
            "contract"  => "Жобалық жұмыс",
        ],
        'work_schedule'            => [
            "full_day"   => "Толық күн",
            "shift"      => "Ауысымдық жұмыс",
            "flexible"   => "Икемді кесте",
            "remote"     => "Қашықтағы жұмыс",
            "rotational" => "Вахта",
        ],
        'driving_license_category' => [
            "category_none" => 'Куәлік жоқ',
            "category_a"    => 'A категориясы',
            "category_b"    => 'B категориясы',
            "category_c"    => 'C категориясы',
            "category_d"    => 'D категориясы',
            "category_be"   => 'BE категориясы',
            "category_ce"   => 'CE категориясы',
            "category_de"   => 'DE категориясы',
            "category_tm"   => 'Трамвай (Tm)',
            "category_tb"   => 'Троллейбус (Tb)',
        ],
    ],
    'roles'         => [
        "employer"     => "Жұмыс беруші",
        "employee"     => "Жұмыс іздеуші",
        "company"      => "Тапсырыс беруші",
        "admin"        => "Администратор",
        "moderator"    => "Модератор",
        "non_graduate" => "Түлек емес",
    ],
    'ad_type'         => [
        "service"     => "Қызмет",
        "product"     => "Тауар",
    ],
];
