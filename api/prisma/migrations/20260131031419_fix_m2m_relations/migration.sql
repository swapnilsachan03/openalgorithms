/*
  Warnings:

  - The primary key for the `BookmarkedProblem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BookmarkedProblem` table. All the data in the column will be lost.
  - The primary key for the `EditorialInteraction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EditorialInteraction` table. All the data in the column will be lost.
  - You are about to drop the column `liked` on the `EditorialInteraction` table. All the data in the column will be lost.
  - The primary key for the `ProblemInteraction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProblemInteraction` table. All the data in the column will be lost.
  - The primary key for the `UserSolutionInteraction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserSolutionInteraction` table. All the data in the column will be lost.
  - You are about to drop the column `liked` on the `UserSolutionInteraction` table. All the data in the column will be lost.
  - You are about to drop the `_ProblemToTopic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `like` to the `EditorialInteraction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `like` to the `UserSolutionInteraction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProblemToTopic" DROP CONSTRAINT "_ProblemToTopic_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProblemToTopic" DROP CONSTRAINT "_ProblemToTopic_B_fkey";

-- DropIndex
DROP INDEX "BookmarkedProblem_userId_problemId_key";

-- DropIndex
DROP INDEX "EditorialInteraction_userId_editorialId_key";

-- DropIndex
DROP INDEX "ProblemInteraction_userId_problemId_key";

-- DropIndex
DROP INDEX "UserSolutionInteraction_userId_userSolutionId_key";

-- AlterTable
ALTER TABLE "BookmarkedProblem" DROP CONSTRAINT "BookmarkedProblem_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "BookmarkedProblem_pkey" PRIMARY KEY ("userId", "problemId");

-- AlterTable
ALTER TABLE "EditorialInteraction" DROP CONSTRAINT "EditorialInteraction_pkey",
DROP COLUMN "id",
DROP COLUMN "liked",
ADD COLUMN     "like" BOOLEAN NOT NULL,
ADD CONSTRAINT "EditorialInteraction_pkey" PRIMARY KEY ("userId", "editorialId");

-- AlterTable
ALTER TABLE "ProblemInteraction" DROP CONSTRAINT "ProblemInteraction_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProblemInteraction_pkey" PRIMARY KEY ("userId", "problemId");

-- AlterTable
ALTER TABLE "UserSolutionInteraction" DROP CONSTRAINT "UserSolutionInteraction_pkey",
DROP COLUMN "id",
DROP COLUMN "liked",
ADD COLUMN     "like" BOOLEAN NOT NULL,
ADD CONSTRAINT "UserSolutionInteraction_pkey" PRIMARY KEY ("userId", "userSolutionId");

-- DropTable
DROP TABLE "_ProblemToTopic";

-- CreateTable
CREATE TABLE "ProblemTopic" (
    "problemId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "ProblemTopic_pkey" PRIMARY KEY ("problemId","topicId")
);

-- AddForeignKey
ALTER TABLE "ProblemTopic" ADD CONSTRAINT "ProblemTopic_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemTopic" ADD CONSTRAINT "ProblemTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
