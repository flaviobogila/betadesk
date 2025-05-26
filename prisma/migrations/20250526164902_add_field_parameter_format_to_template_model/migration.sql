-- CreateEnum
CREATE TYPE "TemplateParameterFormat" AS ENUM ('POSITIONAL', 'NAMED');

-- AlterTable
ALTER TABLE "MessageTemplate" ADD COLUMN     "parameterFormat" "TemplateParameterFormat" NOT NULL DEFAULT 'POSITIONAL';
