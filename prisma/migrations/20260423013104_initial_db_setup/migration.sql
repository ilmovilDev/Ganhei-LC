-- CreateEnum
CREATE TYPE "AppName" AS ENUM ('UBER', 'INDRIVER', 'NINE_NINE', 'NINE_NINE_FOOD', 'IFOOD', 'DELIVERY', 'SHOPEE', 'OTHER');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('FUEL', 'FOOD', 'MAINTENANCE', 'MARKET', 'TOLLS', 'PARKING', 'OTHER');

-- CreateTable
CREATE TABLE "Day" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours" DECIMAL(5,2) NOT NULL,
    "kilometers" DECIMAL(8,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Earning" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "app" "AppName" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Earning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Day_clerkId_date_idx" ON "Day"("clerkId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Day_clerkId_date_key" ON "Day"("clerkId", "date");

-- CreateIndex
CREATE INDEX "Earning_dayId_app_idx" ON "Earning"("dayId", "app");

-- CreateIndex
CREATE UNIQUE INDEX "Earning_dayId_app_key" ON "Earning"("dayId", "app");

-- CreateIndex
CREATE INDEX "Expense_dayId_idx" ON "Expense"("dayId");

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "Expense"("category");

-- AddForeignKey
ALTER TABLE "Earning" ADD CONSTRAINT "Earning_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
