# Skill: create-api-endpoint

Добавление JSON API-эндпоинта в JUMYSTAP (`routes/api.php`).

## Когда использовать
Нужен программный JSON-доступ (для мобильного клиента, внешней интеграции, верификации),
а не Inertia-страница.

## Последовательность
1. **Образец:** `routes/api.php` + `app/Http/Controllers/API/VerificationController.php`
   (`sendCode`/`verifyCode`) и `CertificateController@show`.
2. **Маршрут:** добавь в `routes/api.php`. Защищённые — `->middleware('auth:sanctum')`,
   публичные — без (как verification).
3. **Валидация:** FormRequest в `app/Http/Requests/` (организованы по подкаталогам; пример —
   `app/Http/Requests/API/User/VerifyCodeRequest.php`).
4. **Логика:** в Service; контроллер тонкий.
5. **Ответ:** через трейт `App\Traits\ApiResponse` (`sendResponseSuccess`/`sendResponseError`) —
   НЕ через API Resources (их в проекте нет).
6. **Тест:** Feature-тест на эндпоинт (статус, форма ответа, авторизация).

## Обязательные проверки
- `./vendor/bin/pint`
- `./vendor/bin/pest --filter=...`
- Проверить ответ вручную (curl/Postman) для контракта.

## Expected output
Эндпоинт отвечает корректным JSON через ApiResponse, защищён нужным middleware, покрыт
Feature-тестом, валидация — через FormRequest.
