# Docker + Live-reload (HMR) для разработки

Как поднять проект локально так, чтобы бэкенд работал в Docker, а фронтенд
(JSX/CSS) пересобирался и обновлялся в браузере мгновенно (Vite HMR).

## Зачем нужен отдельный dev-режим

Основной `Dockerfile` собран под **продакшн**: весь код запекается в образ
(`COPY . .`), а `public` и `storage` монтируются как named-volumes. Из-за этого:

- правки кода на хосте (PHP и JSX) в контейнер **не попадают** без пересборки образа;
- `public` в контейнере — это volume `public-data`, отдающий заранее собранный билд.

Dev-режим включается через `docker-compose.override.yml` (compose подхватывает его
автоматически) — он монтирует живой код в контейнер и отдаёт ассеты с Vite-сервера.

## Что делает `docker-compose.override.yml`

```yaml
services:
    app:
        volumes:
            - ./:/var/www/html              # живой код с хоста
            - ./public:/var/www/html/public # перекрыть named-volume public-data
            - /var/www/html/vendor          # анонимный volume — сохранить vendor из образа
        environment:
            RUN_MIGRATIONS: 'false'         # не кэшировать config/route/view в dev

    nginx:
        volumes:
            - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
            - ./public:/var/www/html/public:ro   # nginx видит host public + public/hot
            - storage-data:/var/www/html/storage:ro
```

- `./:/var/www/html` — контейнер читает живой код с хоста (PHP-правки без пересборки).
- `./public:/var/www/html/public` — обязательно: иначе named-volume `public-data`
  перекрывает bind-mount, и контейнер не видит файл `public/hot`.
- `/var/www/html/vendor` — анонимный volume сохраняет `vendor`, собранный в образе,
  поэтому `composer install` на хосте не нужен.
- `RUN_MIGRATIONS: 'false'` — пропускает `config:cache`/`route:cache`/`view:cache`,
  чтобы правки конфига и вьюх подхватывались сразу.

## Запуск

Из корня проекта (`/var/www/jumystap`):

```bash
# 1. Поднять/пересоздать контейнеры с dev-override
docker compose up -d app nginx

# 2. (один раз после первого включения override) снести стейл-кэш вьюх
docker compose exec -T app php artisan view:clear

# 3. Запустить Vite dev-сервер на хосте
npm install        # если node_modules ещё нет
npm run dev        # HMR; в фоне: nohup npm run dev >/tmp/vite-dev.log 2>&1 &
```

> **Важно:** запускать `npm run dev` **без** флага `--host`. С `--host` Vite пишет в
> `public/hot` адрес `http://[::]:5173`, который браузер не может открыть. Без флага
> пишется `http://127.0.0.1:5173` — к нему обращается только браузер с хоста,
> контейнеру доступ к Vite не нужен.

Открывать в браузере: **http://localhost:8085**

## Как это работает

1. `npm run dev` создаёт файл `public/hot` с адресом Vite-сервера (`127.0.0.1:5173`).
2. Через bind-mount `public` этот файл виден и в app-контейнере, и в nginx.
3. Laravel-директива `@vite` при наличии `hot` подставляет в HTML `<script>`-теги,
   указывающие на Vite-сервер, вместо ссылок на собранный `public/build`.
4. Браузер открывает бэкенд из Docker (`:8085`), а JSX/CSS грузит напрямую с
   Vite (`:5173`) — с горячей перезагрузкой.

```
браузер ──HTML──> nginx:8085 ──> php-fpm (Docker, живой код)
   └────JS/CSS+HMR────> Vite dev server :5173 (на хосте)
```

## Локали (i18n)

Строки интерфейса лежат в `public/locales/{kz,ru}/index.json` и грузятся i18next по
HTTP. Браузер их **кэширует** — после правки JSON обновляй страницу с очисткой кэша
(`Ctrl+Shift+R`), HMR их не подхватывает.

## Возврат к прод-режиму

Dev-режим определяется только наличием `docker-compose.override.yml`.

```bash
# временно отключить override и пересобрать прод-стек
mv docker-compose.override.yml docker-compose.override.yml.off
docker compose up -d
```

Полная прод-сборка образа с нуля (запекает свежий `public/build`):

```bash
docker compose build app
docker compose stop app nginx
docker volume rm jumystap_public-data   # иначе отдаётся старый билд из volume
docker compose up -d
```

## Частые проблемы

| Симптом | Причина | Решение |
|---|---|---|
| На `:8085` старый билд, правки не видны | Отдаётся named-volume `public-data`, а не живой `public` | Проверь, что override активен и в нём `./public:/var/www/html/public` |
| Ассеты не грузятся, в консоли ошибки на `[::]:5173` | `npm run dev` запущен с `--host` | Перезапусти `npm run dev` **без** `--host`, удали `public/hot` |
| Правки PHP не применяются | Контейнер поднят без override (код запечён в образ) | `docker compose up -d app` с активным override |
| В `public/hot` нет файла внутри контейнера | `public-data` перекрывает bind-mount | Добавь `./public:/var/www/html/public` в override для `app` |

## Порты

- `8085` — приложение (nginx → php-fpm в Docker)
- `5173` — Vite dev-сервер (на хосте)
- `33061` — MySQL, проброшенный на хост (внутри Docker-сети: `mysql:3306`)
