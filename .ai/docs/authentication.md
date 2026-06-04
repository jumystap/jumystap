# Module: Authentication & Verification

## Назначение
Регистрация/вход пользователей, восстановление пароля, верификация по телефону (SMS-коды),
токены Sanctum для API, админ-логин.

## Ключевые файлы
- Web auth: `AuthController`, `UserController` (login/register/logout в `routes/web.php`).
- Восстановление пароля: `/forgot_password`, `POST /restore_password` (`AuthController`).
- Верификация: `app/Http/Controllers/API/VerificationController.php`
  (`POST /api/send-verification-code`, `POST /api/verify-code`), модель `Code`, канал SMSC.
  Реквесты: `app/Http/Requests/API/User/SendCodeRequest.php`, `.../VerifyCodeRequest.php`.
- Админ: `app/Http/Controllers/Admin/AuthController.php` (`/admin/login`, `/admin/logout`).
- Реквесты: `Auth/LoginRequest`, `API/User/SendCodeRequest`, `API/User/VerifyCodeRequest`,
  `StoreUserRequest` (корень).
- Глобальный share: `HandleInertiaRequests` отдаёт `auth.user`.
- Страницы: `Pages/Login.jsx`, `Pages/Registration.jsx`, `Pages/ForgotPassword.jsx`,
  `Pages/Admin/AdminLogin.jsx`.

## Поведение
- Сессии — драйвер `database`, lifetime 525600 мин (~1 год).
- Sanctum — токен для `/api/user`.
- Коды верификации отправляются через SMSC (`config/services.php` → smsc).
- Заблокированные пользователи разлогиниваются (`BlockedUserLogout`).

## Тесты
`tests/Feature/Auth/*` (Registration, Authentication, PasswordReset, PasswordUpdate,
PasswordConfirmation, EmailVerification).

## TODO / уточнить
- Точная политика троттлинга кодов и срок их жизни — проверить в `VerificationController`/`Code`.
