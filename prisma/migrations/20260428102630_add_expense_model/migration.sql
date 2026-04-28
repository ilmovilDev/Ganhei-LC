-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('FUEL', 'FOOD', 'MAINTENANCE', 'MARKET', 'TOLLS', 'PARKING', 'OTHER');

-- DropEnum
DROP TYPE "ExpenseCategory";

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
CREATE INDEX "Expense_dayId_idx" ON "Expense"("dayId");

-- CreateIndex
CREATE INDEX "Expense_type_idx" ON "Expense"("type");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
