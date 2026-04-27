/*
  Warnings:

  - You are about to alter the column `hours` on the `Day` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.
  - You are about to alter the column `kilometers` on the `Day` table. The data in that column could be lost. The data in that column will be cast from `Decimal(8,2)` to `Integer`.
  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_dayId_fkey";

-- DropIndex
DROP INDEX "Day_clerkId_date_key";

-- DropIndex
DROP INDEX "Earning_dayId_app_idx";

-- DropIndex
DROP INDEX "Earning_dayId_app_key";

-- AlterTable
ALTER TABLE "Day" ALTER COLUMN "hours" SET DATA TYPE INTEGER,
ALTER COLUMN "kilometers" SET DATA TYPE INTEGER;

-- DropTable
DROP TABLE "Expense";

-- CreateIndex
CREATE INDEX "Earning_dayId_idx" ON "Earning"("dayId");

-- CreateIndex
CREATE INDEX "Earning_app_idx" ON "Earning"("app");
