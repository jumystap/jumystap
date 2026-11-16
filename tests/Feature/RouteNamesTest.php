<?php

use Illuminate\Support\Facades\Route;

// route:cache требует уникальных имён маршрутов. В docker/entrypoint.sh он не фатален,
// поэтому дубль на проде молча отключил бы кэш — ловим его здесь.
// Безымянный маршрут внутри группы name('x.') получает имя 'x.' и тоже даёт дубль.
test('route names are unique so route:cache can serialize them', function () {
    $duplicates = collect(Route::getRoutes()->getRoutes())
        ->map(fn ($route) => $route->getName())
        ->filter()
        ->countBy()
        ->filter(fn (int $count) => $count > 1)
        ->keys()
        ->all();

    expect($duplicates)->toBe([]);
});
