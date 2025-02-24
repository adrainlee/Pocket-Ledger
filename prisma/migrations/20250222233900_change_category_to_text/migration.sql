-- 将 category 列转换为 text 类型
ALTER TABLE "expenses" ALTER COLUMN "category" TYPE text USING category::text;

-- 删除不再使用的枚举类型
DROP TYPE IF EXISTS "expense_category";