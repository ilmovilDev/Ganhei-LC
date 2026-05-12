-- CreateEnum
CREATE TYPE "App" AS ENUM ('UBER', 'NINETY_NINE', 'INDRIVE', 'IFOOD', 'NINETY_NINE_FOOD', 'SHOPEE', 'GENERIC_DELIVERY', 'OTHER');

-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('FUEL', 'FOOD', 'MAINTENANCE', 'MARKET', 'TOLLS', 'PARKING', 'OTHER');

-- CreateTable
CREATE TABLE "Day" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "hours" INTEGER NOT NULL,
    "kilometers" DECIMAL(10,2) NOT NULL,
    "totalEarnings" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalExpenses" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "netProfit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Earning" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "app" "App" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Earning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "type" "ExpenseType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "note" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Day_clerkId_idx" ON "Day"("clerkId");

-- CreateIndex
CREATE INDEX "Day_date_idx" ON "Day"("date");

-- CreateIndex
CREATE INDEX "Day_clerkId_date_idx" ON "Day"("clerkId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Day_clerkId_date_key" ON "Day"("clerkId", "date");

-- CreateIndex
CREATE INDEX "Earning_dayId_idx" ON "Earning"("dayId");

-- CreateIndex
CREATE INDEX "Earning_app_idx" ON "Earning"("app");

-- CreateIndex
CREATE INDEX "Earning_dayId_app_idx" ON "Earning"("dayId", "app");

-- CreateIndex
CREATE UNIQUE INDEX "Earning_dayId_app_key" ON "Earning"("dayId", "app");

-- CreateIndex
CREATE INDEX "Expense_dayId_idx" ON "Expense"("dayId");

-- CreateIndex
CREATE INDEX "Expense_type_idx" ON "Expense"("type");

-- CreateIndex
CREATE INDEX "Expense_dayId_type_idx" ON "Expense"("dayId", "type");

-- AddForeignKey
ALTER TABLE "Earning" ADD CONSTRAINT "Earning_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
