/*
  Warnings:

  - The values [FEE] on the enum `expense_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "expense_category_new" AS ENUM ('餐饮', '交通', '医疗', '京东', '淘宝', '拼多多', '商超', '居住', '通讯', '其他');
ALTER TABLE "expenses" ALTER COLUMN "category" TYPE "expense_category_new" USING ("category"::text::"expense_category_new");
ALTER TYPE "expense_category" RENAME TO "expense_category_old";
ALTER TYPE "expense_category_new" RENAME TO "expense_category";
DROP TYPE "expense_category_old";
COMMIT;
