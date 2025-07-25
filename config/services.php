<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key'    => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel'              => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'smsc' => [
        'base_uri' => env('SMSC_URI'),
        'login'    => env('SMSC_LOGIN'),
        'password' => env('SMSC_PSW'),
    ],

    'bitrix'=> [
        'uri' => env('BITRIX_URI', 'https://crm.joltap.kz/rest/1/gsjlekv9xqpwgw3q/')
    ],

    'gender'=> [
        'uri' => env('GENDER_API_URI', 'https://api.genderapi.io/'),
        'key1' => env('GENDER_API_KEY_1', '683ec13028573e4d869109fa'),
        'key2' => env('GENDER_API_KEY_2', '685d0239f060778ce6158d0e'),
        'key3' => env('GENDER_API_KEY_3')
    ],
];
