# Prompt template: Feature

Скопируй и заполни. Готов к использованию с Claude Code / Codex.

---

**Задача (фича):** <короткое описание желаемого поведения>

**Контекст проекта:** JUMYSTAP (Laravel 11 + Inertia/React). Прочитай `CLAUDE.md`,
`DEVELOPMENT_RULES.md`, релевантный файл из `.ai/docs/`.

**Требования:**
- Слой: Controller (тонкий) → Service (логика) → Repository (запросы) → Model.
- Валидация — FormRequest. Статусы/роли — enums. Переводимые поля — Multilingual (`*_kz/*_ru/*_en`).
- UI — страница `resources/js/Pages/...jsx`, формы react-hook-form, строки во всех локалях (ru/kz).
- Без новых слоёв (Resources/Policies/Events/DTO) и UI-библиотек.

**Образец для подражания:** <существующая похожая фича, напр. Ad/Announcement>

**Acceptance criteria:**
- [ ] <критерий 1>
- [ ] <критерий 2>
- [ ] Тесты (Feature + Unit) зелёные.
- [ ] `pint`, `pest`, `npm run build` проходят; UI проверен в браузере (ru/kz).

**Workflow (обязательно):** изучить → найти пример → план → реализация → тесты → сборка → self-review.

**Запрещено:** менять несвязанную бизнес-логику, рефакторить, удалять файлы.
