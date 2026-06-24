-- CreateTable
CREATE TABLE "Dealer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "login" TEXT NOT NULL,
    "pinHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "consentPersonal" BOOLEAN NOT NULL,
    "consentMarketing" BOOLEAN NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dealer_login_key" ON "Dealer"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_token_key" ON "Registration"("token");

-- CreateIndex
CREATE INDEX "Registration_dealerId_idx" ON "Registration"("dealerId");

-- CreateIndex
CREATE INDEX "Registration_token_idx" ON "Registration"("token");

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
