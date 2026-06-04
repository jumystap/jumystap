# Agent: codex

Практический guide для Codex при работе с кодом JUMYSTAP.

## Роль
Codex работает как fullstack-разработчик Laravel + Inertia.js + React: анализирует существующую
реализацию, предлагает план, вносит минимальные изменения по задаче и проверяет результат.

## Старт задачи
1. Прочитать `CLAUDE.md`, `DEVELOPMENT_RULES.md` и релевантный `.ai/context/*`.
2. Найти похожую реализацию в коде или `.ai/docs/*`.
3. Назвать файлы, которые планируется менять, и риск, если изменение может затронуть API/UI.
4. Не трогать `.env`, секреты, production-конфиги и несвязанные файлы.

## Backend
- Контроллеры оставлять тонкими: оркестрация, `Inertia::render(...)` или `ApiResponse`.
- Бизнес-логику размещать в `app/Services/`, запросы к БД — в `app/Repositories/`.
- Валидацию делать через `app/Http/Requests/*`; inline-валидацию не добавлять, если есть FormRequest-паттерн.
- Статусы, роли и типы брать из `app/Enums/`, без новых magic strings/numbers.
- Схему менять только новой миграцией; старые миграции не редактировать.
- API Resources, Policies, Events, DTO, Actions не вводить без явного согласования.

## Frontend
- Inertia-страницы держать в `resources/js/Pages/*`, компоненты — в `resources/js/Components/*`.
- Использовать текущий стек: Tailwind, Ant Design, Headless UI, lucide/react-icons, framer-motion.
- Не добавлять новые UI-библиотеки и state-management без согласования.
- Формы делать через `react-hook-form`; навигацию и мутации — через Inertia `router`, прямые запросы — через `axios`.
- Новые UI-строки добавлять во все локали `public/locales/{ru,kz}` и регистрировать новый namespace в `resources/js/i18n.js`.
- Перед изменением админки определить, это Blade (`resources/views/admin/*`) или React (`resources/js/Pages/Admin/*`).

## Проверки
Запускать только применимые проверки, но явно сообщать, если проверка не запускалась.

```bash
./vendor/bin/pint
./vendor/bin/pest
npm run build
```

Для одного теста использовать:

```bash
./vendor/bin/pest --filter=TestName
```

## Коммуникация
- Сначала факты из кода, затем план, затем изменения.
- Перед правкой указывать список файлов.
- После правки кратко описывать, что изменено и какие проверки прошли.
- Если есть риск сломать route, controller, request, resource, API-контракт или UI-сценарий, остановиться и объяснить риск.
- Commit message давать в стиле истории проекта: `feat: ...`, `fix: ...`, `refactor: ...`, `chore: ...`.
