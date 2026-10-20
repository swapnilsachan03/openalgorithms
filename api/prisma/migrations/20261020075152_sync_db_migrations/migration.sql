/*
  Warnings:

  - Changed the type of `language` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SubmissionLanguage" AS ENUM ('JAVA', 'JAVASCRIPT', 'CPP', 'PYTHON');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "maxMemoryMb" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "maxRuntimeMs" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "language",
ADD COLUMN     "language" "SubmissionLanguage" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
