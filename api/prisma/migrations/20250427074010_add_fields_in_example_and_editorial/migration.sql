/*
  Warnings:

  - Added the required column `title` to the `Editorial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Editorial" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Example" ADD COLUMN     "explanaion" TEXT;
