/*
  Warnings:

  - A unique constraint covering the columns `[clerkId,date]` on the table `Day` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dayId,app]` on the table `Earning` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Day_clerkId_date_key" ON "Day"("clerkId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Earning_dayId_app_key" ON "Earning"("dayId", "app");
