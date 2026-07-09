# Запуск на продакшене (Docker)

Прод-стек полностью описан в `docker-compose.yml` и `Dockerfile`. Образ собирается
под продакшн: фронтенд (`public/build`) и PHP-зависимости (`vendor`, `--no-dev`)
запекаются внутрь образа, ассеты и storage отдаются из named-volumes.

## Состав стека

| Сервис | Что делает | Порт |
|---|---|---|
| `app` | php-fpm с кодом приложения; **на нём** запускаются миграции и прогрев кэша | 9000 (внутр.) |
| `nginx` | отдаёт статику и проксирует PHP на `app:9000` | `${APP_PORT:-80}` → 80 |
| `queue` | `php artisan queue:work` (обработка очередей) | — |
| `scheduler` | `php artisan schedule:work` (крон-задачи) | — |
| `mysql` | MySQL 8.0, данные в volume `mysql-data` | `${FORWARD_DB_PORT:-3306}` → 3306 |

Named-volumes: `mysql-data` (БД), `storage-data` (`storage/`), `public-data` (`public/`).

## Требования

- Docker и Docker Compose v2 на сервере.
- Домен + reverse-proxy/HTTPS перед `nginx` (см. ниже).

## 1. Подготовка `.env`

Скопируй `.env.example` → `.env` и выставь **прод-значения**:

```dotenv
APP_NAME=JUMYSTAP
APP_ENV=production
APP_DEBUG=false
APP_KEY=                      # сгенерится автоматически при первом старте, либо: php artisan key:generate
APP_URL=https://твой-домен

APP_PORT=80                   # порт, который слушает nginx на хосте

DB_CONNECTION=mysql
DB_HOST=mysql                 # имя сервиса внутри docker-сети (НЕ 127.0.0.1)
DB_PORT=3306
DB_DATABASE=jumystap
DB_USERNAME=jumystap
DB_PASSWORD=<надёжный-пароль>

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

# MAIL_*, TELEGRAPH_* и прочие интеграции — реальные креды
```

> `docker-compose.yml` переопределяет `DB_HOST=mysql` и `DB_PORT=3306` через блок
> `environment:` для контейнеров, поэтому внутри Docker БД всегда доступна как `mysql:3306`.

> **Секреты:** не коммить `.env`. Пароль БД в `.env` должен совпадать с тем, что
> получит контейнер `mysql` (он берёт `DB_DATABASE/DB_USERNAME/DB_PASSWORD` из `.env`).

## 2. Отключить dev-override

`docker-compose.override.yml` (dev-режим с bind-mount и live-reload) подхватывается
compose **автоматически**. На проде его быть не должно:

```bash
# убедись, что override нет в рабочей директории (или переименуй)
mv docker-compose.override.yml docker-compose.override.yml.off 2>/dev/null || true
```

Либо всегда запускай прод явно одним файлом: `docker compose -f docker-compose.yml ...`.

## 3. Сборка и запуск

```bash
docker compose build            # собрать образ app (frontend + vendor + рантайм)
docker compose up -d            # поднять весь стек
```

При первом старте контейнер `app` (через `docker/entrypoint.sh`, `RUN_MIGRATIONS=true`):

1. создаёт скелет `storage/`, выставляет права;
2. генерирует `APP_KEY`, если его нет;
3. ждёт готовности MySQL;
4. выполняет `php artisan migrate --force`;
5. `storage:link`, `config:cache`, `route:cache`, `view:cache`.

Проверка:

```bash
docker compose ps
docker compose logs -f app
curl -I http://localhost:${APP_PORT:-80}
```

## 4. HTTPS / reverse-proxy

Контейнер `nginx` слушает только HTTP (`:80`). Терминируй TLS снаружи:

- внешний Nginx/Caddy/Traefik или облачный балансировщик проксирует `443 → APP_PORT`;
- пробрось заголовки `X-Forwarded-Proto https` и настрой `TrustProxies`, если нужно;
- `APP_URL` должен быть `https://...`, иначе ссылки/ассеты будут ломаться.

## 5. Обновление (redeploy)

```bash
git pull

docker compose build app        # пересобрать образ с новым кодом и фронтендом
docker compose up -d            # пересоздать app/queue/scheduler/nginx
```

> **Важно — ассеты фронтенда.** `public` смонтирован как named-volume `public-data`.
> Он наполняется из образа **только при первом создании** и НЕ обновляется при
> пересборке. Если менялся фронтенд (`public/build`), пересоздай volume:
>
> ```bash
> docker compose stop app nginx
> docker volume rm jumystap_public-data   # имя = <проект>_public-data (см. docker volume ls)
> docker compose up -d                    # volume пересоздастся из свежего образа
> ```

Миграции при рестарте `app` выполняются автоматически (`RUN_MIGRATIONS=true`).
Разово вручную:

```bash
docker compose exec app php artisan migrate --force
docker compose exec app php artisan config:cache
```

## 6. Обслуживание

```bash
# логи
docker compose logs -f app nginx queue scheduler

# artisan внутри контейнера
docker compose exec app php artisan <command>

# бэкап БД
docker compose exec mysql mysqldump -u root -p"$DB_PASSWORD" jumystap > backup_$(date +%F).sql

# перезапуск воркеров после деплоя (подхватить новый код очередями)
docker compose restart queue scheduler
```

## Частые проблемы

| Симптом | Причина | Решение |
|---|---|---|
| На проде старый фронтенд после деплоя | `public-data` не обновляется при ребилде | Пересоздать volume (см. п.5) |
| Внезапно включился live-reload / bind-mount | В директории остался `docker-compose.override.yml` | Убрать/переименовать override |
| `app` крутится в рестарте, ждёт БД | MySQL не готов или неверные креды | Проверь `DB_*` в `.env` и логи `mysql` |
| 500 без деталей | `APP_DEBUG=false` (правильно для прода) | Смотри `docker compose logs app` и `storage/logs` |
| Ссылки/ассеты по http вместо https | `APP_URL` не https / нет проксирования заголовков | Выстави `APP_URL=https://...`, настрой TrustProxies |

## Порты

- `APP_PORT` (по умолч. `80`) — публичный HTTP nginx.
- `FORWARD_DB_PORT` (по умолч. `3306`) — проброс MySQL на хост. **На проде лучше не
  пробрасывать** — убери `ports:` у `mysql` или закрой фаерволом.
