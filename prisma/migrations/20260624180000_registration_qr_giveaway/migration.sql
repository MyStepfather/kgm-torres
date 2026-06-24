-- AlterTable: add new columns as nullable first
ALTER TABLE "Registration" ADD COLUMN "phoneNormalized" TEXT;
ALTER TABLE "Registration" ADD COLUMN "scanUrl" TEXT;
ALTER TABLE "Registration" ADD COLUMN "qrDataUrl" TEXT;

-- Backfill phoneNormalized from phone (best effort)
UPDATE "Registration"
SET "phoneNormalized" = regexp_replace("phone", '\D', '', 'g')
WHERE "phoneNormalized" IS NULL;

UPDATE "Registration"
SET "phoneNormalized" = '7' || substring("phoneNormalized" from 2)
WHERE "phoneNormalized" LIKE '8%' AND length("phoneNormalized") = 11;

UPDATE "Registration"
SET "phoneNormalized" = '7' || "phoneNormalized"
WHERE length("phoneNormalized") = 10;

-- Backfill scanUrl for existing rows
UPDATE "Registration"
SET "scanUrl" = 'http://localhost:3000/dealer/scan/' || "token"
WHERE "scanUrl" IS NULL;

-- Placeholder qrDataUrl for existing rows (will be regenerated on next access)
UPDATE "Registration"
SET "qrDataUrl" = ''
WHERE "qrDataUrl" IS NULL;

-- Make columns required
ALTER TABLE "Registration" ALTER COLUMN "phoneNormalized" SET NOT NULL;
ALTER TABLE "Registration" ALTER COLUMN "scanUrl" SET NOT NULL;
ALTER TABLE "Registration" ALTER COLUMN "qrDataUrl" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Registration_phoneNormalized_key" ON "Registration"("phoneNormalized");
CREATE UNIQUE INDEX "Registration_email_key" ON "Registration"("email");
CREATE INDEX "Registration_isActivated_idx" ON "Registration"("isActivated");

-- CreateTable
CREATE TABLE "GiveawayRun" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiveawayRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiveawayWinner" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "place" INTEGER NOT NULL,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiveawayWinner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayWinner_registrationId_key" ON "GiveawayWinner"("registrationId");
CREATE INDEX "GiveawayWinner_runId_idx" ON "GiveawayWinner"("runId");

-- AddForeignKey
ALTER TABLE "GiveawayWinner" ADD CONSTRAINT "GiveawayWinner_runId_fkey" FOREIGN KEY ("runId") REFERENCES "GiveawayRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GiveawayWinner" ADD CONSTRAINT "GiveawayWinner_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
