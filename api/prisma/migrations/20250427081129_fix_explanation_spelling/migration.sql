/*
  Warnings:

  - You are about to drop the column `explanaion` on the `Example` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Example" DROP COLUMN "explanaion",
ADD COLUMN     "explanation" TEXT;
