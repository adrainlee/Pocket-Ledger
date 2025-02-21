#!/bin/sh
# wait-for-postgres.sh

set -e

# 等待PostgreSQL准备就绪
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing migrations"

# 执行数据库迁移（使用本地安装的prisma）
cd /app && npx prisma migrate deploy

>&2 echo "Starting application"
exec "$@"