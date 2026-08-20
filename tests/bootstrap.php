<?php

/*
|--------------------------------------------------------------------------
| Test environment isolation
|--------------------------------------------------------------------------
|
| The Docker `app` container injects the whole `.env` file as *real* OS
| environment variables (docker-compose `env_file: .env`). Laravel reads
| those from $_SERVER / $_ENV through an *immutable* dotenv repository, so
| they win over both `.env.testing` and phpunit.xml's <env> values — even
| with force="true", which only sets putenv/$_ENV, not $_SERVER.
|
| Without this, running `php artisan test` inside the app container makes
| RefreshDatabase run `migrate:fresh` against the real `jumystap` database
| and WIPE it. We pin the test-only values into all three superglobals
| BEFORE the framework boots so the isolated `testing` database is used.
*/
foreach ([
    'APP_ENV'                => 'testing',
    'APP_MAINTENANCE_DRIVER' => 'file',
    'BCRYPT_ROUNDS'          => '4',
    'CACHE_STORE'            => 'array',
    'DB_DATABASE'            => 'testing',
    'MAIL_MAILER'            => 'array',
    'PULSE_ENABLED'          => 'false',
    'QUEUE_CONNECTION'       => 'sync',
    'SESSION_DRIVER'         => 'array',
    'TELESCOPE_ENABLED'      => 'false',
] as $key => $value) {
    putenv("{$key}={$value}");
    $_ENV[$key]    = $value;
    $_SERVER[$key] = $value;
}

require __DIR__.'/../vendor/autoload.php';
