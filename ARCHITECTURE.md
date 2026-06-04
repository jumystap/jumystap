# ARCHITECTURE — JUMYSTAP

Техническая архитектура: слои, паттерны, потоки данных, дерево проекта. Бизнес-смысл — в
`PROJECT_CONTEXT.md`; правила написания кода — в `DEVELOPMENT_RULES.md`.

---

## 1. Архитектурный стиль

Монолитный **server-driven SPA** на Inertia.js: один Laravel-монорепозиторий рендерит React-страницы
без отдельного REST-фронтенда. Бэкенд организован по слоям:

```
HTTP (Route) → Middleware → Controller → Service → Repository → Eloquent Model → DB
                                  │
                                  └── FormRequest (валидация)
Controller → Inertia::render('Page', props) → resources/js/Pages/Page.jsx (React)
```

Ключевой паттерн — **Controller → Service → Repository**. Контроллеры тонкие; бизнес-логика в
`app/Services`, доступ к данным в `app/Repositories`. Сервисы получают репозитории через
конструкторную DI.

---

## 2. Слои приложения

| Слой | Каталог | Ответственность |
|------|---------|-----------------|
| Маршруты | `routes/` | web.php (публичные + auth), admin.php (включён в web.php), api.php (sanctum), console.php |
| Middleware | `app/Http/Middleware/` | Inertia share, admin-гейт, блокировка, трекинг визитов |
| Контроллеры | `app/Http/Controllers/` (+ `Admin/`, `Api/`) | оркестрация: вызвать сервис, вернуть Inertia/JSON |
| Валидация | `app/Http/Requests/` | FormRequest-классы (18 файлов, в подкаталогах: `Admin/`, `Announcement/`, `API/`, `Auth/`, `User/` + корневые) |
| Сервисы | `app/Services/` | бизнес-логика |
| Репозитории | `app/Repositories/` | запросы/персистенс Eloquent |
| Модели | `app/Models/` (+ `Profession/`) | Eloquent + связи + трейты |
| Enums | `app/Enums/` | типизированные статусы/роли/типы (10 шт.) |
| Трейты | `app/Traits/` | `Multilingual`, `ApiResponse` |
| Observers | `app/Observers/` | `AnnouncementObserver`, `UserObserver` |
| Rules | `app/Rules/` | `CheckAnnouncementAuthor` |
| Jobs | `app/Jobs/` | `TrackVisitJob` |
| Console | `app/Console/Commands/` | 5 команд (Bitrix, gender, архивация) |
| Telegram | `app/Telegram/` | `Handler.php` (telegraph) |
| Helpers | `app/Helpers/` | `TextHelper`, `DateHelper` |
| Фронтенд | `resources/js/` | React-страницы, компоненты, layouts, i18n |

> ⚠️ В проекте **нет** `app/Http/Resources/`, `app/Policies/`, `app/Events/`, `app/Listeners/`,
> `app/Notifications/`, `app/Mail/`, DTO и Actions. Авторизация — через middleware и проверки
> ролей; уведомления — кастомный сервис. Не выдумывай эти слои — следуй существующим паттернам.

---

## 3. Паттерны

- **Service Layer** — `AdService`, `AnnouncementService`, `HomeService`, `UserService`,
  `FavoriteService`, `ReviewService`, `CertificateService`, `AnalyticsService`,
  `Notification\NotificationService` (+ каналы `SmscChannel`, `EmailChannel`, `SmsChannel`).
- **Repository** — по одному на агрегат: `AdRepository`, `AnnouncementRepository`,
  `UserRepository`, `HomeRepository`, `FavoriteRepository`, `ReviewRepository`,
  `CertificateRepository`, `AnalyticsRepository`.
- **FormRequest validation** — валидация выносится из контроллеров (`StoreAdRequest`,
  `AnnouncementCreateRequest`, `LoginRequest`, `VerifyCodeRequest` и др.).
- **Enum-typed states** — статусы/роли/типы как PHP enum c методами (`AdStatus::label()`,
  `color()`, `badgeClass()`, `canEdit()`; `Roles::label()`, `options()`).
- **Multilingual trait** — мультиязычные атрибуты `*_kz/*_ru/*_en`, чтение через `$model->name`
  с нормализацией `kk→kz`.
- **Observer** — `AnnouncementObserver` на жизненный цикл вакансии.
- **Custom validation Rule** — `CheckAnnouncementAuthor`.

---

## 4. Очереди (queues)

- Драйвер — `database` (`config/queue.php`, `QUEUE_CONNECTION=database`). Таблицы `jobs`,
  `job_batches`, `failed_jobs`.
- Единственный job — `App\Jobs\TrackVisitJob` (`ShouldQueue`), пишет `Visit`.
- ⚠️ В текущем `TrackVisits` middleware визит записывается **синхронно** в `terminating()`-колбэке,
  а постановка `TrackVisitJob` в очередь закомментирована. Воркер всё равно нужен на случай
  будущих задач. См. `.ai/memory/known-limitations.md`.
- Запуск воркера: `php artisan queue:work` (в Docker — сервис `queue`).

---

## 5. События (events)

Стандартного event/listener-механизма Laravel в проекте **нет**. Реактивная логика реализована
через:
- **Observer** (`AnnouncementObserver`) — хук на изменения `Announcement`;
- **Telegram callbacks** (`app/Telegram/Handler.php`) — accept/reject меняют статус объявления;
- **Middleware terminating callback** (`TrackVisits`) — постобработка запроса.

> Если задача требует событийной модели — это новая инфраструктура, согласуй подход (см. промпт
> `.ai/prompts/feature.md`).

---

## 6. API

`routes/api.php` минимален:

| Метод | Путь | Контроллер | Auth |
|-------|------|-----------|------|
| GET | `/api/user` | inline (Sanctum) | `auth:sanctum` |
| GET | `/api/certificates/{id}` | `CertificateController@show` | public |
| POST | `/api/send-verification-code` | `API\VerificationController@sendCode` | public |
| POST | `/api/verify-code` | `API\VerificationController@verifyCode` | public |

JSON-ответы формируются через трейт `App\Traits\ApiResponse` (`sendResponseSuccess`/
`sendResponseError`), API Resources не используются. Основное взаимодействие фронтенда с
бэкендом — через **Inertia** (props + `router`), а не REST.

---

## 7. Аутентификация и доступ

- Web-сессии (`SESSION_DRIVER=database`, lifetime 525600 мин ≈ 1 год).
- Sanctum — токены для `/api/user`.
- Верификация по телефону: коды через SMSC (`Code` модель, `VerificationController`).
- Глобальный share Inertia: `HandleInertiaRequests` отдаёт `auth.user` (id, name, email, role).
- `AdminMiddleware` — доступ в `/admin/*` только admin/moderator.
- `BlockedUserLogout` — разлогинивает `is_blocked` пользователей.

---

## 8. Frontend (Inertia + React)

- Точка входа `resources/js/app.jsx`: `createInertiaApp` + `I18nextProvider`, резолв страниц
  `./Pages/${name}.jsx`, прогресс-бар `#4B5563`.
- ~40 страниц: публичные (`Pages/*`), `Pages/Admin/*` (через `AdminLayout`),
  `Pages/Company/*`. Layouts: `GuestLayout`, `AdminLayout`.
- Компоненты: модалки (Portfolio/Certificate/Feedback/Scam/Info), общие (Carousel, Pagination,
  ShareButtons…), подкаталоги `Components/Mobile/`, `Components/Welcome/`.
- Состояние: **без Redux/Zustand** — серверное состояние через Inertia-props, локальное — `useState`.
  Нет каталогов `hooks/`, `utils/`, `services/`, `contexts/` — логика живёт в страницах.
- Формы — `react-hook-form`; прямые запросы — `axios` (feedback, portfolio, logout); навигация и
  большинство мутаций — Inertia `router`.
- UI: Ant Design + Tailwind + Headless UI + lucide-react/react-icons + framer-motion + react-slick.
- i18n: `resources/js/i18n.js`, namespaces грузятся по HTTP из `public/locales/{lng}/{ns}.json`
  (языки `ru`, `kz`). Namespaces в массиве `ns` — header, index, employees, profession,
  announcements, login, carousel, register, faq, updateNonEmployee, createAnnouncement.
- Корневой шаблон — `resources/views/app.blade.php` (GTM + Яндекс-метрика, шрифты).
- Алиасы: `@/` → `resources/js/`, `ziggy-js` → `vendor/tightenco/ziggy` (`jsconfig.json`/`vite.config.js`).

> ⚠️ Часть админки также отрендерена через **Blade** (`resources/views/admin/*`: account, ads,
> analytics, announcements, certificates, users, layouts, partials), наряду с React-страницами
> `Pages/Admin/*`. При правках админки уточняй, Blade это или Inertia-страница.

---

## 9. Локализация (две системы)

1. **Фронтенд (React)** — `react-i18next`, JSON из `public/locales/{ru,kz}/{ns}.json`. Новые UI-строки
   добавлять во все локали и регистрировать namespace в `ns` (`resources/js/i18n.js`).
2. **Бэкенд (контент БД)** — трейт `App\Traits\Multilingual`: колонки `*_ru/*_kz/*_en`, чтение через
   `$model->name`, нормализация `kk→kz`. `getTranslation($attr,$locale)`, `getTranslations($attr)`.
3. **Framework-строки** — `lang/{en,kk,ru}/`.

---

## 10. Дерево проекта (ключевое)

```
jumystap/
├── app/
│   ├── Console/
│   │   ├── Commands/        # GetCertificates, UpdateCertificates, DeleteCertificates,
│   │   │                    #   FixGender, ArchiveOldAnnouncements
│   │   └── Kernel.php       # расписание (daily 00:01–04:01)
│   ├── Enums/               # AdStatus, AdType, AnnouncementStatus, Roles, PriceType,
│   │                        #   EmploymentType, WorkSchedule, EducationLevel,
│   │                        #   DrivingLicenseCategory, NotificationChannel
│   ├── Helpers/             # TextHelper, DateHelper
│   ├── Http/
│   │   ├── Controllers/     # Home, Ad, Announcement, Auth, Certificate, Favorite, Feedback,
│   │   │   │                #   Portfolio, Profession, Profile, Review, Resume, User... + Analytic
│   │   │   ├── Admin/       # Account, Ad, Analytic, Announcement, Auth, Certificate, Home,
│   │   │   │                #   Response, User  (NB: корневой AdminController — НЕ в Admin/)
│   │   │   └── API/         # VerificationController  (namespace App\Http\Controllers\API)
│   │   ├── Middleware/      # HandleInertiaRequests, AdminMiddleware, BlockedUserLogout, TrackVisits
│   │   └── Requests/        # 18 FormRequest (подкаталоги Admin/, Announcement/, API/, Auth/, User/)
│   ├── Jobs/                # TrackVisitJob
│   ├── Models/
│   │   ├── Profession/      # Profession, GroupProfession, ProfessionSkills, ProfessionTeachers,
│   │   │                    #   ProfessionImages, ProfessionEquimpments, Equipment*, TeacherSkills
│   │   └── *                # User, Announcement, Ad(+ children), Resume*, Response, Review,
│   │                        #   Certificate, Favorite, Visit, City, Industry, TelegramAdmin, ...
│   ├── Observers/           # AnnouncementObserver, UserObserver
│   ├── Repositories/        # 8 репозиториев
│   ├── Rules/               # CheckAnnouncementAuthor
│   ├── Services/            # 8 сервисов + Notification/ (NotificationService + каналы)
│   ├── Telegram/            # Handler.php (telegraph)
│   └── Traits/              # Multilingual, ApiResponse
├── bootstrap/app.php        # bootstrap Laravel 11; web-middleware группа; /up health
├── config/                  # database, queue, cache, session, sanctum, telegraph(custom),
│                            #   services(custom: smsc/bitrix/gender), image, telescope, ...
├── database/
│   ├── migrations/          # ~106 миграций
│   ├── factories/           # UserFactory
│   └── seeders/             # 27 сидеров (роли, города, профессии, демо-объявления)
├── docker/                  # nginx/, php/, entrypoint.sh
├── lang/{en,kk,ru}/         # framework-строки
├── public/
│   ├── build/               # собранные ассеты Vite
│   └── locales/{ru,kz}/     # i18next namespaces (JSON)
├── resources/
│   ├── js/
│   │   ├── app.jsx          # entry + I18nextProvider
│   │   ├── i18n.js
│   │   ├── Pages/           # ~40 страниц (+ Admin/, Company/)
│   │   ├── Components/      # модалки, общие, Mobile/, Welcome/
│   │   └── Layouts/         # GuestLayout, AdminLayout
│   └── views/               # app.blade.php (Inertia shell) + admin/* (Blade) + pdf/
├── routes/                  # web.php, admin.php, api.php, console.php
├── tests/                   # Feature/{Auth,Controllers}, Unit/{Repositories,Services,Controllers}
├── Dockerfile               # multi-stage: node → composer → php:8.2-fpm
├── docker-compose.yml       # app, nginx, queue, scheduler, mysql
├── CLAUDE.md / AGENTS.md / PROJECT_CONTEXT.md / DEVELOPMENT_RULES.md
└── .ai/                     # AI-инфраструктура (agents, skills, prompts, context, docs, memory)
```

---

## 11. Деплой / runtime

- Сборка: `Dockerfile` (frontend-стейдж `npm run build` → composer `--no-dev` → php-fpm рантайм
  с GD/intl/zip/pdo_mysql и бинарями оптимизатора изображений).
- `docker-compose.yml`: `app` (php-fpm + entrypoint: миграции, storage:link, config/route/view cache),
  `nginx`, `queue` (`queue:work`), `scheduler` (`schedule:work`), `mysql:8.0`. Тома `public-data`,
  `storage-data`, `mysql-data`.
- CI/CD — отсутствует (TODO). Health-check — `/up`.
