import { Worker } from "bullmq";
import { redis } from "@lib/redis";
import { prisma } from "@lib/prisma";
import { SubmissionStatus } from "@/prisma/generated/prisma/enums";

const worker = new Worker(
  "submissions",
  async (job) => {
    const { submissionId, code, language, problemId } = job.data;

    console.log(`[${submissionId}] Starting execution...`);

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.JUDGING,
      },
    });

    try {
      // spin up an ecs container to judge
    } catch (error) {
      console.error(`[${submissionId}] Failed to start Fartgate task: `, error);
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  },
);
