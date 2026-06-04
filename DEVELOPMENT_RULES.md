# DEVELOPMENT_RULES — JUMYSTAP

Правила выведены из **реального кода** проекта (не идеальные best-practices, а то, как принято
здесь). Следуй им, чтобы изменения были консистентны. Где практика проекта расходится с «идеалом»,
это отмечено.

---

## 1. Бэкенд (Laravel)

### 1.1 Слоистость
- **Контроллеры тонкие**: оркестрация, не бизнес-логика. Контроллер вызывает Service и возвращает
  `Inertia::render(...)` или (для API) ответ через трейт `ApiResponse`.
- **Бизнес-логика — в `app/Services/`**. Новая доменная логика идёт в существующий или новый Service.
- **Запросы к БД — в `app/Repositories/`**. Не пиши сложные Eloquent/SQL-запросы прямо в контроллере.
  Service вызывает Repository; Repository знает Eloquent.
- Один Service/Repository на агрегат (Ad, Announcement, User, Home, Favorite, Review, Certificate,
  Analytics). Расширяй существующий, не плоди дубли.

### 1.2 Валидация
- **Только через FormRequest** (`app/Http/Requests/`). Реквесты организованы по подкаталогам:
  `Admin/`, `Announcement/`, `API/`, `Auth/`, `User/` (+ несколько корневых) — клади новый в
  подкаталог его домена. Не валидируй инлайн в контроллере, если рядом есть FormRequest-паттерн.
  Именование: `StoreXRequest`, `UpdateXRequest`, `XCreateRequest`, `XUpdateRequest`
  (в проекте встречаются оба стиля — смотри соседние файлы домена).
- Кастомные правила — в `app/Rules/` (пример: `CheckAnnouncementAuthor`).

### 1.3 Статусы, роли, типы
- Используй **enums** из `app/Enums/`, не «магические» строки/числа. У статусных enum есть
  методы-хелперы (`label()`, `color()`, `badgeClass()`, `canEdit()`, `isPublished()` и т.п.) — пользуйся ими.
- Роли: только `App\Enums\Roles` (employer=1, employee=2, company=3, admin=4, moderator=5,
  non_graduate=6). Проверки доступа — через роль, как в `AdminMiddleware`.

### 1.4 Мультиязычность данных
- Переводимые поля — колонки `*_kz/*_ru/*_en`; модель подключает трейт `App\Traits\Multilingual`.
- Чтение — через виртуальный атрибут (`$model->name`), не обращайся к `name_ru` напрямую в шаблонах,
  если можно прочитать локализованно. Локаль `kk` нормализуется в `kz`.

### 1.5 API
- JSON-ответы — через `App\Traits\ApiResponse` (`sendResponseSuccess`/`sendResponseError`).
- API Resources в проекте **не используются** — не вводи их без согласования; следуй ApiResponse.

### 1.6 Чего НЕ делать
- ❌ Не пиши SQL/тяжёлые запросы в контроллерах.
- ❌ Не создавай Policies/Resources/Events/Listeners/DTO/Actions «для красоты» — их в проекте нет,
  паттерн другой. Если действительно нужно — согласуй (см. `.ai/prompts/feature.md`).
- ❌ Не дублируй бизнес-логику между контроллером и сервисом.
- ❌ Не меняй существующую бизнес-логику при не связанных задачах (без рефакторинга «заодно»).

---

## 2. База данных

- Изменения схемы — **только через миграции** (`database/migrations/`). Не редактируй прошлые
  миграции — добавляй новые. В проекте ~106 миграций, многие — `ALTER` поверх базовых таблиц
  (это норма здесь).
- Реальное подключение задаётся `DB_CONNECTION` в `.env` (`mysql`), хотя `config/database.php`
  имеет `default => 'sqlite'`. Не полагайся на дефолт конфига.
- Справочные данные (роли, города, профессии, специализации) — через **сидеры**
  (`database/seeders/`). Демо-контент тоже сидерами.
- Фабрики: есть только `UserFactory`. Для тестов новых сущностей добавляй фабрику при необходимости.
- Внешние ключи и soft deletes используются у `Ad`/`Announcement`/`User` — соблюдай конвенцию.

---

## 3. Тестирование

- Фреймворк — **Pest** (`./vendor/bin/pest`). Стиль PHPUnit-совместимый.
- Размещение:
  - HTTP/Inertia-сценарии → `tests/Feature/` (`Auth/`, `Controllers/`).
  - Изолированные классы → `tests/Unit/` (`Repositories/`, `Services/`, `Controllers/`).
- Feature-тесты используют `RefreshDatabase` (см. `tests/Pest.php`).
- Тестовое окружение форсится `phpunit.xml`: `DB_DATABASE=testing`, `CACHE_STORE=array`,
  `QUEUE_CONNECTION=sync`, `SESSION_DRIVER=array`, `BCRYPT_ROUNDS=4`. Не хардкодь прод-конфиг в тестах.
- Новая фича/багфикс → добавляй/обновляй тест в соответствующем каталоге.

---

## 4. Стиль кода

- **PHP**: Laravel Pint (`./vendor/bin/pint`) — запускай перед коммитом. Стандарт — Laravel preset.
- **Именование**: модели в единственном числе, контроллеры `XController`, реквесты `XRequest`,
  сервисы `XService`, репозитории `XRepository`, enum по сущности (`AdStatus`).
- **Комментарии**: по минимуму, объясняют «почему», а не «что». Код самодокументируемый.
- Не оставляй закомментированный код в новых правках (в проекте такое встречается — не плоди новое).

---

## 5. Фронтенд (React + Inertia)

- Страницы — `resources/js/Pages/{Area}/Name.jsx`, рендерятся из контроллера
  `Inertia::render('Name', props)`. Алиас `@/` → `resources/js/`.
- Состояние: серверное — через **Inertia-props**; локальное — `useState`. Redux/Zustand/Context-стора
  в проекте нет — не вводи без необходимости.
- Формы — `react-hook-form`. Прямые запросы — `axios` (как feedback/portfolio/logout); навигация и
  мутации — Inertia `router`.
- UI-библиотеки: **сопоставляй с соседними компонентами** — Ant Design + Tailwind + Headless UI +
  lucide-react/react-icons + framer-motion + react-slick. Не подмешивай новые UI-библиотеки.
- Layouts: публичные страницы — `GuestLayout`, админ — `AdminLayout`.
- i18n: новые строки — во **все** локали (`public/locales/ru`, `public/locales/kz`) и в нужный
  namespace; новый namespace регистрируй в `ns` (`resources/js/i18n.js`).
- Часть админки — Blade (`resources/views/admin/*`). Прежде чем менять админ-экран, определи,
  Blade это или React-страница.

---

## 6. Безопасность

- Не логируй и не коммить секреты (`SMSC_*`, `BITRIX_URI`, `GENDER_API_*`, `APP_KEY`, БД-креды).
- Пользовательский ввод проходит FormRequest-валидацию; экранируй вывод (на фронте — `dompurify`
  для HTML-контента, он уже в зависимостях).
- Доступ в админку — только через `AdminMiddleware`. Авторские проверки — как `CheckAnnouncementAuthor`.
- Подробнее — `.ai/context/security-rules.md`.

---

## 7. Очереди и команды

- Фоновые задачи — `ShouldQueue` jobs (`app/Jobs/`), драйвер `database`. Запуск воркера обязателен в
  проде (`queue:work`).
- Периодические задачи — `app/Console/Kernel.php` + команды `app/Console/Commands/`. В проде нужен
  cron `schedule:run`.

---

## 8. Обязательные проверки после изменений

Запускай перед тем, как считать задачу выполненной (детали — в `.ai/` и README):

```bash
./vendor/bin/pint            # стиль PHP
./vendor/bin/pest            # тесты
npm run build                # сборка фронтенда не падает
```

Для фронтенд/UI-изменений — проверь в браузере (Inertia-навигация, формы, локали ru/kz).
