<?php

return [
    'errors'        => [
        'incorrect_login_or_password' => 'Неверный логин или пароль. Пожалуйста, попробуйте снова.',
        'account_is_blocked'          => 'Ваш аккаунт заблокирован.',
        'resume_creation_not_available' => 'Создание резюме доступно только соискателям.',
    ],
    'announcements' => [
        'errors' => [
            'not_found'                 => 'Объявления не найдено!',
            'does_not_access_to_view'   => 'У вас нет доступа на просмотр этого объявления!',
            'does_not_access_to_update' => 'У вас нет доступа на изменение этого объявления!',
            'does_not_access_to_delete' => 'У вас нет доступа на удаление этого объявления!',
        ]
    ],
    'user'          => [
        'gender' => [
            'male'   => 'Мужчина',
            'female' => 'Женщина',
        ]
    ],
    'resume'        => [
        'education_level'          => [
            "secondary"         => "Среднее",
            "secondary_special" => "Среднее специальное",
            "incomplete_higher" => "Неоконченное высшее",
            "higher"            => "Высшее",
        ],
        'employment_type'          => [
            "full_time" => "Полная занятость",
            "part_time" => "Частичная занятость",
            "temporary" => "Подработка",
            "contract"  => "Проектная работа",
        ],
        'work_schedule'            => [
            "full_day"   => "Полный день",
            "shift"      => "Сменный график",
            "flexible"   => "Гибкий график",
            "remote"     => "Удаленная работа",
            "rotational" => "Вахта",
        ],
        'driving_license_category' => [
            "category_none" => 'Нет прав',
            "category_a"    => 'Категория A',
            "category_b"    => 'Категория B',
            "category_c"    => 'Категория C',
            "category_d"    => 'Категория D',
            "category_be"   => 'Категория BE',
            "category_ce"   => 'Категория CE',
            "category_de"   => 'Категория DE',
            "category_tm"   => 'Трамвай (Tm)',
            "category_tb"   => 'Троллейбус (Tb)',
        ],
        'pdf'                      => [
            'birth_date'         => 'Дата рождения',
            'age'                => 'год|года|лет',
            'section_experience' => 'Опыт работы',
            'section_joltap'     => 'Выпускник JOLTAP',
            'section_skills'     => 'Профессиональные навыки',
            'section_education'  => 'Образование',
            'section_additional' => 'Дополнительно',
            'joltap_note'        => 'Выпускник образовательных курсов JOLTAP',
            'joltap_courses'     => 'Пройденные курсы',
            'languages'          => 'Языки',
            'driving_license'    => 'Водительские права',
            'ip_yes'             => 'ИП присутствует',
            'ip_no'              => 'ИП отсутствует',
            'car_yes'            => 'Автомобиль есть',
            'car_no'             => 'Автомобиля нет',
            'until_now'          => 'по настоящее время',
        ],
    ],
    'roles'         => [
        "employer"     => "Работодатель",
        "employee"     => "Соискатель",
        "company"      => "Заказчик",
        "admin"        => "Администратор",
        "moderator"    => "Модератор",
        "non_graduate" => "Не выпускник",
    ],
    'ad_type'         => [
        "service"     => "Услуга",
        "product"     => "Товар",
    ],
];
