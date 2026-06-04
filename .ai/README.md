# .ai — AI-инфраструктура JUMYSTAP

Каталог с контекстом, ролями и шаблонами для разработки через Claude Code, Codex и AI-агентов.
Точка входа для людей и агентов — корневые `CLAUDE.md` и `AGENTS.md`.

## Структура

| Каталог | Назначение |
|---------|-----------|
| `agents/` | Роли агентов: ответственность, область, ограничения, workflow, checklist |
| `skills/` | Пошаговые навыки (CRUD, API, тесты, рефакторинг, оптимизация, багфикс, ревью) |
| `prompts/` | Готовые шаблоны промптов (feature/bugfix/refactor/migration/code-review/performance) |
| `context/` | Сжатый контекст: бизнес-правила, БД, API, фронтенд, безопасность |
| `docs/` | Документация реальных модулей проекта |
| `memory/` | Решения, стиль, известные ограничения, типовые ошибки, ADR |

## Как пользоваться
1. Начни с `CLAUDE.md` (workflow и жёсткие ограничения) и нужного файла `context/`.
2. Для типовой задачи открой соответствующий `skills/*` и `prompts/*`.
3. Сверяйся с `docs/<модуль>.md` по затрагиваемой области.
4. После значимого решения/находки — обнови `memory/*`.

## Файлы
- agents: backend-laravel, frontend-react, database, qa-review, devops, code-review
- skills: create-crud, create-api-endpoint, write-tests, refactor-module, optimize-query, fix-bug, review-code
- prompts: feature, bugfix, refactor, migration, code-review, performance
- context: business-rules, database, api-rules, frontend-rules, security-rules
- docs: authentication, announcements, ads, users-profiles, resumes, professions-certificates,
  telegram-moderation, analytics-visits, admin, notifications
- memory: project-decisions, coding-style, known-limitations, common-mistakes, architectural-decisions
