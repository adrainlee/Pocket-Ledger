#!/bin/sh
# wait-for-postgres.sh

set -e

# 等待PostgreSQL准备就绪
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - checking schema"

# 检查 public schema 是否存在，如果不存在则创建
PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO public;
"

>&2 echo "Schema ready - executing migrations"

# 执行数据库迁移
cd /app && npx prisma migrate deploy

>&2 echo "Starting application"
exec "$@"