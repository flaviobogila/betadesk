/*
  Warnings:

  - The values [TRANSACTIONAL] on the enum `TemplateCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TemplateCategory_new" AS ENUM ('MARKETING', 'UTILITY', 'OTP');
ALTER TABLE "MessageTemplate" ALTER COLUMN "category" TYPE "TemplateCategory_new" USING ("category"::text::"TemplateCategory_new");
ALTER TYPE "TemplateCategory" RENAME TO "TemplateCategory_old";
ALTER TYPE "TemplateCategory_new" RENAME TO "TemplateCategory";
DROP TYPE "TemplateCategory_old";
COMMIT;
