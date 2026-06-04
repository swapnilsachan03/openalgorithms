/*
  Warnings:

  - Added the required column `title` to the `UserSolution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSolution" ADD COLUMN     "title" TEXT NOT NULL;
