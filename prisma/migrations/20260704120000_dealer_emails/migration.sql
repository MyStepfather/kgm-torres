-- AlterTable
ALTER TABLE "Dealer" ADD COLUMN "emails" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- MigrateData
UPDATE "Dealer"
SET "emails" = ARRAY["email"]
WHERE "email" IS NOT NULL AND BTRIM("email") <> '';

-- AlterTable
ALTER TABLE "Dealer" DROP COLUMN "email";
