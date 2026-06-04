/*
  Warnings:

  - You are about to drop the `PublishedSolution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublishedSolutionInteraction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PublishedSolution" DROP CONSTRAINT "PublishedSolution_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedSolution" DROP CONSTRAINT "PublishedSolution_problemId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedSolutionInteraction" DROP CONSTRAINT "PublishedSolutionInteraction_publishedSolutionId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedSolutionInteraction" DROP CONSTRAINT "PublishedSolutionInteraction_userId_fkey";

-- DropTable
DROP TABLE "PublishedSolution";

-- DropTable
DROP TABLE "PublishedSolutionInteraction";

-- CreateTable
CREATE TABLE "UserSolution" (
    "id" TEXT NOT NULL,
    "authorId" TEXT,
    "problemId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSolutionInteraction" (
    "id" TEXT NOT NULL,
    "userSolutionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL,

    CONSTRAINT "UserSolutionInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSolutionInteraction_userId_userSolutionId_key" ON "UserSolutionInteraction"("userId", "userSolutionId");

-- AddForeignKey
ALTER TABLE "UserSolution" ADD CONSTRAINT "UserSolution_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSolution" ADD CONSTRAINT "UserSolution_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSolutionInteraction" ADD CONSTRAINT "UserSolutionInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSolutionInteraction" ADD CONSTRAINT "UserSolutionInteraction_userSolutionId_fkey" FOREIGN KEY ("userSolutionId") REFERENCES "UserSolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
