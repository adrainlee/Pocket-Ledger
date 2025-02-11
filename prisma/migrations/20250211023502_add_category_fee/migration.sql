-- AlterEnum
ALTER TYPE "expense_category" ADD VALUE IF NOT EXISTS 'FEE';

-- Update enum mapping comment
COMMENT ON TYPE "expense_category" IS E'@map({\"FEE\": \"生活缴费\"})';