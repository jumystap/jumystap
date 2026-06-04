# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## AI development infrastructure

This repo is prepared for long-term AI-assisted development. Read these before non-trivial work:

- `PROJECT_CONTEXT.md` — business domain, entities, roles, processes.
- `ARCHITECTURE.md` — layers, patterns, project tree, queues/events/API.
- `DEVELOPMENT_RULES.md` — coding rules derived from the real codebase.
- `AGENTS.md` — agent roles (also `Codex`/other tools read this file).
- `.ai/` — agents, skills, prompts, context, per-module docs, and memory (decisions, known
  limitations, common mistakes). When you learn a durable fact or make a decision, update the
  relevant `.ai/memory/*` file.

## Mandatory workflow

For any change (feature, bugfix, refactor — though refactors must be explicitly requested):

1. **Study the existing implementation** — read the relevant controller → service → repository →
   model chain and the matching `resources/js/Pages` / Blade view.
2. **Find similar examples** — locate a comparable feature already in the codebase and mirror its
   structure, naming, and patterns. Check `.ai/docs/` and `.ai/skills/`.
3. **Make a plan** — outline the change against `DEVELOPMENT_RULES.md`; note which layer each edit
   belongs to. Do not invent layers the project doesn't use (no Resources/Policies/Events/DTO).
4. **Implement** — thin controllers, logic in Services, queries in Repositories, validation in
   FormRequests, statuses via Enums, translatable fields via the `Multilingual` trait.
5. **Run tests** — `./vendor/bin/pest` (add/update tests in the correct `Feature`/`Unit` subdir).
6. **Check the build** — `npm run build` for frontend changes; `./vendor/bin/pint` for PHP style.
7. **Self-review** — re-read the diff against `DEVELOPMENT_RULES.md` and the security rules in
   `.ai/context/security-rules.md`; confirm no business logic was changed beyond scope.

## Hard constraints

- Do not change unrelated existing business logic; do not refactor unless explicitly asked.
- Do not introduce new architectural layers or UI libraries inconsistent with the codebase.
- Add translatable strings to **all** locales; never commit secrets.

## Project

JUMYSTAP — a Kazakh job/services marketplace (job seekers, employers, freelance ads). Laravel 11 backend with an Inertia.js + React (JSX) frontend, served as a single monorepo. PHP 8.2, Node + Vite. The runtime DB is MySQL (`DB_CONNECTION=mysql` in `.env.example`; `docker-compose.yml` runs `mysql:8.0`). Note `config/database.php` ships `default => 'sqlite'`, so the connection is decided solely by `DB_CONNECTION`.

## Commands

```bash
# Frontend
npm install
npm run dev            # Vite dev server with HMR
npm run build          # Production assets into public/build

# Backend
composer install
php artisan serve
php artisan migrate
php artisan key:generate

# Tests (Pest, PHPUnit-style)
./vendor/bin/pest                       # all tests
./vendor/bin/pest --filter=TestName     # one test/file
./vendor/bin/pest tests/Feature/Auth    # one directory

# Lint / format
./vendor/bin/pint                       # Laravel Pint (PHP code style)

# Scheduled / one-off console commands (see app/Console/Commands — real signatures)
php artisan app:announcements:archive-old             # ArchiveOldAnnouncementsCommand
php artisan app:get-certificates {work|digital}       # GetCertificatesCommand ({type} arg)
php artisan app:update-certificates {work|digital}    # UpdateCertificatesCommand
php artisan app:delete-certificates {work|digital}    # DeleteCertificatesCommand
php artisan app:fix-gender {arg}                       # FixGenderCommand (requires arg)
```

## Architecture

### Request flow

1. Browser hits a route in `routes/web.php` (public + auth user area) or `routes/admin.php` (admin area, included from `web.php`). `routes/api.php` is small — only sanctum user + verification + certificate API. `bootstrap/app.php` is the Laravel 11 application bootstrap and registers middleware.
2. Web routes are wrapped by Inertia (`HandleInertiaRequests` shares `auth.user` globally). Admin routes additionally require `AdminMiddleware`. Two other custom middleware run on every web request: `BlockedUserLogout` and `TrackVisits` (which dispatches `TrackVisitJob`).
3. Controllers in `app/Http/Controllers` follow a **Controller → Service → Repository → Eloquent Model** layering. The `Services/` directory holds business logic (e.g. `AnnouncementService`, `AdService`, `HomeService`) and `Repositories/` holds query/persistence logic. New domain logic should slot into this pattern rather than living directly in controllers.
4. Controllers respond with `Inertia::render('PageName', $props)`, which mounts the React component at `resources/js/Pages/PageName.jsx`.

### Admin area

Admin code is segregated: controllers under `app/Http/Controllers/Admin/`, routes in `routes/admin.php`, and React pages in `resources/js/Pages/Admin/` using `Layouts/AdminLayout.jsx`. The public site uses `Layouts/GuestLayout.jsx`. Admin login is at `/admin/login` and gated by `AdminMiddleware`.

### Frontend (Inertia + React)

- Entry: `resources/js/app.jsx` creates the Inertia app and wraps it in `I18nextProvider`. Page resolution is `./Pages/${name}.jsx`.
- Path alias: `@/*` → `resources/js/*` (see `jsconfig.json`).
- UI stack: Tailwind CSS + Ant Design + Headless UI + lucide-react / react-icons. Forms use react-hook-form. Phone input via react-phone-input-2. Avoid mixing redundant UI libs — match what neighboring components already use.
- Vite config (`vite.config.js`) emits hashed filenames in `assets/[name]-[hash].js` for cache busting.

### Internationalization

The app is **trilingual**: Kazakh (`kk` in the frontend, stored as `kz` suffix on DB columns), Russian (`ru`), English (`en`). Two i18n systems coexist:

- **Frontend (React)**: `react-i18next` loads JSON namespaces from `public/locales/{lng}/{ns}.json` over HTTP (configured in `resources/js/i18n.js`). When adding UI strings, add to the existing namespace file in **all three** locales — `public/locales/ru`, `public/locales/kz`, and the corresponding `en` location. Don't introduce a new namespace without also registering it in the `ns` array in `i18n.js`.
- **Backend (DB content)**: Multilingual model attributes use the `App\Traits\Multilingual` trait. A model with columns `name_ru`/`name_kz`/`name_en` is read via `$model->name`, which auto-resolves to the current `app()->getLocale()` (with `kk → kz` normalization). When adding translatable fields, mirror this `*_ru`/`*_kz`/`*_en` column convention so the trait picks them up. `getTranslation($attr, $locale)` and `getTranslations($attr)` are also available.
- The Laravel-side `lang/` directory has `en/`, `kk/`, `ru/` for framework-level strings (validation, etc.).

### Domain glossary

The main entities are: **User** (with `role_id` and `Roles` enum — employee, employer, etc.), **Announcement** (job postings, with `Address`/`Condition`/`Requirement`/`Responsibility` child models and `AnnouncementHistory` audit), **Ad** (marketplace product/service ads, with `Photo`/`Contact`/`Category`/`StatusHistory`/`View` children and `AdStatus`/`AdType` enums), **Resume** + **UserResume** + **UserCV**, **Profession** (under `App\Models\Profession\*` — has groups, skills, equipment, teacher subtrees), **Response** (a user's response to an announcement), **Review**, **Certificate**, **Favorite**, **Visit** (analytics). Status, type, role, schedule, license, education values are typed via PHP enums in `app/Enums/`.

### Telegram

Telegram bot integration uses `defstudio/telegraph`. Webhook endpoint is `POST /telegram/webhook` (in `routes/web.php`) and command handling lives in `app/Telegram/Handler.php`. `TelegramAdmin` model tracks registered admin chat IDs that receive announcement-status notifications.

### Testing

Pest with the Laravel plugin. `phpunit.xml` forces an in-memory test env: `DB_DATABASE=testing`, `CACHE_STORE=array`, `QUEUE_CONNECTION=sync`, `SESSION_DRIVER=array`. Tests live under `tests/Feature/{Auth,Controllers}` and `tests/Unit/{Repositories,Services}` — keep that split when adding tests (HTTP/Inertia interactions go in Feature, isolated class tests in Unit).

Read also AGENTS.md
