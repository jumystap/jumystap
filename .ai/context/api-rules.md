# Context: API rules

## Где API
`routes/api.php` (префикс `/api`). Основное взаимодействие фронт↔бэк — через **Inertia** (props +
`router`), а не REST. API минимален и нужен для верификации/мобильных/интеграций.

## Текущие эндпоинты
| Метод | Путь | Контроллер | Auth |
|-------|------|-----------|------|
| GET | `/api/user` | inline | `auth:sanctum` |
| GET | `/api/certificates/{id}` | `CertificateController@show` | public |
| POST | `/api/send-verification-code` | `API\VerificationController@sendCode` | public |
| POST | `/api/verify-code` | `API\VerificationController@verifyCode` | public |

## Правила добавления эндпоинта
- Защита — `auth:sanctum` для приватных; публичные — осознанно (как verification).
- Валидация — FormRequest (`app/Http/Requests/`).
- Логика — в Service; контроллер тонкий.
- Ответ — через трейт `App\Traits\ApiResponse` (`sendResponseSuccess`/`sendResponseError`).
  **API Resources не используются** — не вводить.
- Покрытие — Feature-тест (статус, форма ответа, авторизация).
- Rate-limiting / троттлинг для публичных эндпоинтов отправки кодов — учитывай (verification).

## Инертия-«контракт»
- Имя страницы в `Inertia::render('Name', $props)` должно совпадать с `resources/js/Pages/Name.jsx`.
- Глобально доступен `auth.user` (id, name, email, role) из `HandleInertiaRequests`.
- Маршруты экспортируются во фронт через Ziggy (`route()` в JS).
