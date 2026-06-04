# Prompt template: Database migration

---

**Изменение схемы:** <добавить таблицу/колонку/индекс/FK>

**Сущность/таблица:** <users / announcements / ads / ...>

**Поля:** <имя:тип:ограничения>. Если поле переводимое — три колонки `*_kz/*_ru/*_en`.

**Указания:**
- Только НОВАЯ миграция (`php artisan make:migration`), старые не трогать. Обязателен `down()`.
- Учитывай soft deletes (Ad/Announcement/User) и существующие FK/индексы.
- Реальное подключение — MySQL из `.env` (не sqlite из конфига).
- Справочные данные — сидером, не хардкодом.
- Обнови `$fillable`/касты/связи модели и при необходимости фабрику.

**Acceptance criteria:**
- [ ] `php artisan migrate` и `migrate:fresh --seed` отрабатывают.
- [ ] Откат `migrate:rollback` корректен.
- [ ] Модель и тесты обновлены; `pest` зелёный.

Следуй агенту `.ai/agents/database.md`.
