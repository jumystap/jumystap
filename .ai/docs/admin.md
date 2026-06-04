# Module: Admin area

## Назначение
Панель администрирования: пользователи, объявления (ads), вакансии (announcements), сертификаты,
отклики, аналитика, аккаунт.

## Доступ
- Маршруты — `routes/admin.php` (включён из `web.php`). Гейт — `AdminMiddleware` (admin/moderator).
- Логин — `/admin/login` (`Admin\AuthController`).

## Ключевые файлы
- ⚠️ **`AdminController` лежит в КОРНЕ** `app/Http/Controllers/AdminController.php` (дашборды:
  employers/employees/companies/certificates), а НЕ в `Admin/`.
- Контроллеры `app/Http/Controllers/Admin/*`: `AccountController`, `AdController`, `AnalyticController`,
  `AnnouncementController`, `AuthController`, `CertificateController`, `HomeController`,
  `ResponseController`, `UserController`.
- Реквесты (`app/Http/Requests/Admin/`): `Ad/StoreAdRequest`, `Ad/UpdateAdRequest`,
  `Announcement/AnnouncementUpdateRequest`, `Certificate/CertificateStoreRequest`,
  `User/UserStoreRequest`, `User/UserUpdateRequest`, `User/UserProfileRequest`.
- View-слой: **смешанный** —
  - Blade: `resources/views/admin/*` (account, ads, analytics, announcements, certificates, users,
    layouts, partials).
  - React: `resources/js/Pages/Admin/*` (AdminLogin, AdminCertificates, AdminComponies,
    AdminEmployees, AdminEmployers) через `AdminLayout`.

## Важно
- Перед правкой админ-экрана определи технологию (Blade или Inertia/React) — они сосуществуют.
- Ресурсные маршруты: users, announcements, certificates, ads (с approve/reject/bulkAction).

## TODO / уточнить
- Какие именно экраны на Blade, а какие на React — карта соответствия (составить при первой правке).
