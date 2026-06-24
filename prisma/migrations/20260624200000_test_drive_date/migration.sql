-- AlterTable
ALTER TABLE "Registration" ADD COLUMN "testDriveDate" DATE;

UPDATE "Registration"
SET "testDriveDate" = "createdAt"::date
WHERE "testDriveDate" IS NULL;

ALTER TABLE "Registration" ALTER COLUMN "testDriveDate" SET NOT NULL;
