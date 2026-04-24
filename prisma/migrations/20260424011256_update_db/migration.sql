/*
  Warnings:

  - Changed the type of `app` on the `Earning` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "App" AS ENUM ('UBER', 'INDRIVER', 'NINE_NINE', 'NINE_NINE_FOOD', 'IFOOD', 'DELIVERY', 'SHOPEE', 'OTHER');

-- AlterTable
ALTER TABLE "Earning" DROP COLUMN "app",
ADD COLUMN     "app" "App" NOT NULL;

-- DropEnum
DROP TYPE "AppName";

-- CreateIndex
CREATE INDEX "Earning_dayId_app_idx" ON "Earning"("dayId", "app");

-- CreateIndex
CREATE UNIQUE INDEX "Earning_dayId_app_key" ON "Earning"("dayId", "app");
