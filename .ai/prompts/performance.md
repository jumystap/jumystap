# Prompt template: Performance

---

**Проблема производительности:** <медленная страница/эндпоинт/команда>

**Симптомы:** <время отклика, N+1, тяжёлый список, нагрузка>

**Указания:**
- Запросы — в `app/Repositories/` (`AdRepository`, `AnnouncementRepository`,
  `AnalyticsRepository`, `HomeRepository`). Диагностируй через Telescope или `DB::enableQueryLog()`.
- Типовые приёмы: eager loading (`with`), `select` нужных колонок, индексы (новой миграцией),
  пагинация, кэш (драйвер `database`).
- Бизнес-результат выборки не менять — только эффективность.

**Acceptance criteria:**
- [ ] Замер до/после (кол-во запросов, время).
- [ ] Идентичный результат данных.
- [ ] Индексы добавлены миграцией (если нужны); `migrate` ок.
- [ ] `pest` зелёный.

Следуй `.ai/skills/optimize-query.md`. Типовой приём — в `.ai/memory/architectural-decisions.md`.
