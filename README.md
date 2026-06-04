# JUMYSTAP

JUMYSTAP — казахстанский маркетплейс труда и услуг: соискатели, работодатели и компании
размещают вакансии (announcements), товары/услуги (ads), резюме и откликаются на объявления.
Платформа также синхронизирует сертификаты выпускников из Bitrix и модерирует объявления
через Telegram-бота.

Монорепозиторий: Laravel 11 (бэкенд) + Inertia.js + React (JSX) фронтенд, единый Vite-билд.

> Подробный AI-контекст для разработки через Claude Code / Codex / агентов — см. `CLAUDE.md`,
> `AGENTS.md`, `PROJECT_CONTEXT.md`, `ARCHITECTURE.md`, `DEVELOPMENT_RULES.md` и каталог `.ai/`.

---

## Стек технологий

**Backend**
- PHP 8.2, Laravel 11
- Inertia.js (laravel adapter) — серверный роутинг страниц
- Laravel Sanctum — токен-аутентификация для `routes/api.php`
- defstudio/telegraph — Telegram-бот и вебхук
- intervention/image-laravel + spatie/laravel-image-optimizer — обработка изображений
- barryvdh/laravel-dompdf — генерация PDF
- jenssegers/agent — определение устройства для аналитики посещений
- tightenco/ziggy — экспорт маршрутов во фронтенд

**Frontend**
- React 18 (JSX), Inertia.js (@inertiajs/react)
- Vite 6
- Tailwind CSS 3 + @tailwindcss/forms
- Ant Design 5, Headless UI, lucide-react, react-icons, framer-motion, react-slick
- react-hook-form (формы), axios (прямые запросы), react-phone-input-2 / react-input-mask
- i18next + react-i18next (локализация ru/kz)

**Данные и инфраструктура**
- MySQL 8 (в `.env.example` — `DB_CONNECTION=mysql`)
  > ⚠️ `config/database.php` имеет `default => 'sqlite'`, поэтому реальное подключение задаётся
  > только через `DB_CONNECTION` в `.env`. См. `.ai/context/database.md`.
- Очереди, кэш и сессии — драйвер `database` (без Redis по умолчанию)
- Docker (multi-stage `Dockerfile` + `docker-compose.yml`: app/nginx/queue/scheduler/mysql)

**Тесты / качество**
- Pest 2 (+ pest-plugin-laravel), PHPUnit-совместимый
- Laravel Pint — стиль кода PHP

---

## Требования

- PHP 8.2+ с расширениями: `pdo_mysql`, `mbstring`, `gd`, `zip`, `bcmath`, `exif`, `intl`, `pcntl`
- Composer 2
- Node.js 20+ и npm
- MySQL 8 (или Docker)
- Бинарники оптимизации изображений (для `spatie/laravel-image-optimizer`):
  `jpegoptim`, `optipng`, `pngquant`, `gifsicle`, `webp` — уже ставятся в `Dockerfile`

---

## Установка (локально, без Docker)

```bash
# 1. Зависимости
composer install
npm install

# 2. Окружение
cp .env.example .env
php artisan key:generate
# отредактируйте .env: DB_CONNECTION=mysql, DB_DATABASE, DB_USERNAME, DB_PASSWORD,
# а также сторонние ключи (SMSC_*, BITRIX_URI, GENDER_API_*) при необходимости

# 3. База данных
php artisan migrate
php artisan db:seed          # роли, города, профессии, демо-данные (27 сидеров)

# 4. Симлинк для загруженных файлов
php artisan storage:link
```

## Запуск (локально)

```bash
php artisan serve            # бэкенд на http://localhost:8000
npm run dev                  # Vite dev-сервер с HMR (в отдельном терминале)

# Воркер очереди (visit-трекинг, фоновые задачи)
php artisan queue:work

# Планировщик (синк сертификатов, fix-gender, архивация) — в проде через cron:
# * * * * * php /path/artisan schedule:run >> /dev/null 2>&1
php artisan schedule:work    # локальный аналог
```

## Запуск через Docker

```bash
cp .env.example .env         # выставьте APP_KEY (или сгенерится в entrypoint), DB_PASSWORD
docker compose build
docker compose up -d
# сайт: http://localhost  (порт ${APP_PORT:-80})
```

Сервисы compose: `app` (php-fpm, миграции/кэш в entrypoint), `nginx`, `queue` (`queue:work`),
`scheduler` (`schedule:work`), `mysql:8.0`. Общие тома `public-data` и `storage-data`.
Детали — в `.ai/context/` и `docker/`.

---

## Тестирование

```bash
./vendor/bin/pest                       # все тесты
./vendor/bin/pest --filter=TestName     # один тест/файл
./vendor/bin/pest tests/Feature/Auth    # один каталог
```

`phpunit.xml` форсирует in-memory окружение тестов: `DB_DATABASE=testing`, `CACHE_STORE=array`,
`QUEUE_CONNECTION=sync`, `SESSION_DRIVER=array`, `BCRYPT_ROUNDS=4`. Feature-тесты используют
`RefreshDatabase`. Структура: `tests/Feature/{Auth,Controllers}`, `tests/Unit/{Repositories,Services,Controllers}`.

---

## Сборка фронтенда

```bash
npm run dev                  # разработка (HMR)
npm run build                # прод-ассеты в public/build (хешированные имена для cache-busting)
```

Точка входа — `resources/js/app.jsx`. Страницы резолвятся из `resources/js/Pages/{name}.jsx`.
Алиас `@/` → `resources/js/`.

---

## Деплой

CI/CD пайплайн в репозитории **отсутствует** (нет `.github/workflows`, `.gitlab-ci.yml`,
Forge/Envoyer конфигов). Деплой выполняется вручную или через Docker.

Чек-лист релиза (вручную):

```bash
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force
php artisan config:cache && php artisan route:cache && php artisan view:cache
php artisan storage:link
# перезапустить queue:work и убедиться, что schedule:run в cron
```

> TODO: при добавлении CI/CD задокументировать пайплайн здесь и в `.ai/context/`/`devops` агенте.

---

## Команды обслуживания (artisan)

```bash
php artisan app:get-certificates {work|digital}     # синк сертификатов из Bitrix
php artisan app:update-certificates {work|digital}  # полный пересинк
php artisan app:delete-certificates {work|digital}  # удаление устаревших
php artisan app:fix-gender {arg}                     # определение пола через внешний API (сигнатура требует аргумент)
php artisan app:announcements:archive-old            # архивация объявлений старше 6 мес.
```

Расписание этих команд — в `app/Console/Kernel.php`.

---

## Документация для разработчиков и AI-агентов

| Файл | Назначение |
|------|------------|
| `CLAUDE.md` | Главный AI-контекст и обязательный workflow |
| `AGENTS.md` | Роли AI-агентов (backend/frontend/db/qa/devops/review) |
| `PROJECT_CONTEXT.md` | Бизнес-домен, сущности, процессы, роли |
| `ARCHITECTURE.md` | Слои, паттерны, дерево проекта, очереди/события/API |
| `DEVELOPMENT_RULES.md` | Правила кодирования (выведены из реального кода) |
| `.ai/` | Агенты, скиллы, промпты, контекст, доки модулей, память решений |

## Лицензия

Laravel framework распространяется под [MIT license](https://opensource.org/licenses/MIT).
