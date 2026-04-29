/*
  Warnings:

  - The values [INDRIVER,NINE_NINE,NINE_NINE_FOOD,DELIVERY] on the enum `App` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "App_new" AS ENUM ('UBER', 'NINETY_NINE', 'INDRIVE', 'IFOOD', 'NINETY_NINE_FOOD', 'SHOPEE', 'GENERIC_DELIVERY', 'OTHER');
ALTER TABLE "Earning" ALTER COLUMN "app" TYPE "App_new" USING ("app"::text::"App_new");
ALTER TYPE "App" RENAME TO "App_old";
ALTER TYPE "App_new" RENAME TO "App";
DROP TYPE "public"."App_old";
COMMIT;
