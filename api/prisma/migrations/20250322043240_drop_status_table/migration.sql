/*
  Warnings:

  - You are about to drop the column `statusId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'JUDGING', 'ACCEPTED', 'WRONG_ANSWER', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'INTERNAL_ERROR');

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_statusId_fkey";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "statusId",
ADD COLUMN     "status" "SubmissionStatus" NOT NULL,
ADD COLUMN     "verdict" BOOLEAN;

-- DropTable
DROP TABLE "Status";
