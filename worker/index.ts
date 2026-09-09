import "dotenv/config";

import { Worker } from "bullmq";
import { redis } from "@lib/redis";
import { prisma } from "@lib/prisma";
import { SubmissionStatus } from "@/prisma/generated/prisma/enums";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { Testcase } from "./prisma/generated/prisma/client";

const RUNNER_FUNCTIONS: Record<string, string> = {
  python: "openalgorithms-python-runner",
  cpp: "openalgorithms-cpp-runner",
  java: "openalgorithms-java-runner",
  javascript: "openalgorithms-node-runner",
};

type JobData = {
  submissionId: string;
  code: string;
  language: string;
  testCases: Testcase[];
  timeLimitSeconds: number;
  memoryLimitMB: number;
};

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION,
});

const worker = new Worker(
  "submissions",
  async (job) => {
    const {
      language,
      submissionId,
      code,
      testCases,
      timeLimitSeconds,
      memoryLimitMB,
    } = job.data as JobData;

    console.log(`[${submissionId}] Starting execution...`);

    try {
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: SubmissionStatus.JUDGING,
        },
      });

      const functionName = RUNNER_FUNCTIONS[language.toLowerCase()];

      if (!functionName) {
        throw new Error(
          `No runner configured for language: ${language.toLowerCase()}`,
        );
      }

      const command = new InvokeCommand({
        FunctionName: functionName,
        InvocationType: "RequestResponse", // blocks until the runner returns
        Payload: Buffer.from(
          JSON.stringify({
            submissionId,
            code,
            testCases,
            timeLimitSeconds,
            memoryLimitMB,
          }),
        ),
      });

      const response = await lambdaClient.send(command);

      if (response.FunctionError) {
        const errPayload = response.Payload
          ? JSON.parse(Buffer.from(response.Payload).toString())
          : null;

        throw new Error(
          `Runner encountered an error\n(${response.FunctionError}): ${JSON.stringify(errPayload)}`,
        );
      }

      const result = response.Payload
        ? JSON.parse(Buffer.from(response.Payload).toString())
        : null;

      const status = result?.verdict || "INTERNAL_ERROR";
      const maxMemoryMb = result?.maxMemoryMb || 0.0;
      const maxRuntimeMs = result?.maxRuntimeMs || 0;

      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status,
          maxMemoryMb,
          maxRuntimeMs,
          verdict: status === "ACCEPTED" ? true : false,
        },
      });
    } catch (error) {
      console.error(`[${submissionId}] Failed to run Lambda task: `, error);
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  },
);
