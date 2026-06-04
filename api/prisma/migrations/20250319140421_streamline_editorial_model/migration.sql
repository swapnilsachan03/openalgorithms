/*
  Warnings:

  - You are about to drop the column `authorId` on the `Editorial` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `PublishedSolution` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `PublishedSolution` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `PublishedSolution` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PublishedSolution` table. All the data in the column will be lost.
  - Added the required column `content` to the `PublishedSolution` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Editorial" DROP CONSTRAINT "Editorial_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedSolution" DROP CONSTRAINT "PublishedSolution_userId_fkey";

-- AlterTable
ALTER TABLE "Editorial" DROP COLUMN "authorId";

-- AlterTable
ALTER TABLE "PublishedSolution" DROP COLUMN "code",
DROP COLUMN "explanation",
DROP COLUMN "language",
DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "content" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PublishedSolution" ADD CONSTRAINT "PublishedSolution_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
