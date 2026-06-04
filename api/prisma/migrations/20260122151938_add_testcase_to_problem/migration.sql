-- CreateTable
CREATE TABLE "Testcase" (
    "id" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "Testcase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Testcase" ADD CONSTRAINT "Testcase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
