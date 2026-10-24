-- AlterEnum
ALTER TYPE "SubmissionStatus" ADD VALUE 'BAD_USER_INPUT';

-- CreateTable
CREATE TABLE "CodeRun" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "language" "SubmissionLanguage" NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "verdict" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maxMemoryMb" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "maxRuntimeMs" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CodeRun_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CodeRun" ADD CONSTRAINT "CodeRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeRun" ADD CONSTRAINT "CodeRun_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
