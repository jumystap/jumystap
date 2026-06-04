#!/usr/bin/env bash
set -e

cd /var/www/html

# Ensure Laravel storage skeleton exists (named volume may start empty)
mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/framework/testing \
    storage/logs
chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache

# Generate APP_KEY if missing
if ! grep -q '^APP_KEY=base64:' .env 2>/dev/null; then
    php artisan key:generate --force || true
fi

# Wait for the database to accept connections
echo "Waiting for database at ${DB_HOST:-mysql}:${DB_PORT:-3306}..."
until php -r "exit(@fsockopen(getenv('DB_HOST') ?: 'mysql', (int)(getenv('DB_PORT') ?: 3306)) ? 0 : 1);"; do
    sleep 2
done
echo "Database is up."

# Only the main app container runs migrations / cache warmup
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force
    php artisan storage:link || true
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

exec "$@"
