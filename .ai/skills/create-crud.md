# Skill: create-crud

Добавление нового CRUD-агрегата в JUMYSTAP по принятому паттерну Controller → Service → Repository.

## Когда использовать
Появляется новая сущность с операциями создания/просмотра/обновления/удаления и UI-страницами.

## Последовательность
1. **Образец:** изучи `Ad` как эталон полноценного CRUD: `AdController`, `AdService`,
   `AdRepository`, `StoreAdRequest`/`UpdateAdRequest`, модель `Ad` + дети, enum `AdStatus`,
   страницы `Pages/Ads*.jsx`.
2. **Миграция:** новая миграция в `database/migrations/` (переводимые поля — `*_kz/*_ru/*_en`,
   при необходимости soft deletes, FK, индексы). При необходимости — сидер/фабрика.
3. **Модель:** `app/Models/X.php` — связи, `$fillable`, трейт `Multilingual` для переводимых полей,
   касты enum.
4. **Enum:** статус/тип в `app/Enums/` с методами `label()`/`color()` при необходимости.
5. **Repository:** `app/Repositories/XRepository.php` — все запросы/фильтры/персистенс.
6. **Service:** `app/Services/XService.php` — бизнес-логика, инъекция репозитория.
7. **FormRequest:** `StoreXRequest`/`UpdateXRequest` в `app/Http/Requests/` (в подкаталоге домена,
   напр. `app/Http/Requests/<Domain>/`).
8. **Controller:** `app/Http/Controllers/XController.php` (или `Admin/`), тонкий, вызывает Service,
   возвращает `Inertia::render('X', $props)`.
9. **Routes:** добавить в `routes/web.php` (или `admin.php`) с нужным middleware (`auth`, admin).
10. **Frontend:** страницы `resources/js/Pages/X*.jsx`, layout, формы `react-hook-form`,
    локализация в `public/locales/{ru,kz}` + namespace в `i18n.js`.
11. **Тесты:** Unit для Repository/Service, Feature для контроллера.

## Обязательные проверки
- `./vendor/bin/pint`
- `./vendor/bin/pest`
- `npm run build` + проверка UI в браузере (ru/kz)
- `php artisan migrate` без ошибок

## Expected output
Рабочий CRUD: миграция применяется, страницы открываются, валидация работает, тесты зелёные,
строки локализованы, бизнес-логика в Service, запросы в Repository.
