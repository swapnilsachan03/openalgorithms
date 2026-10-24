import { prisma } from "@lib/prisma";
import { SubmissionStatus } from "@/prisma/generated/prisma/enums";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { Testcase } from "../prisma/generated/prisma/client";
import { lambdaClient, RUNNER_FUNCTIONS } from "..";

type SubmissionData = {
  submissionId: string;
  code: string;
  language: string;
  testCases: Testcase[];
  timeLimitSeconds: number;
  memoryLimitMB: number;
};

export const processSubmission = async (job: { data: SubmissionData }) => {
  const {
    language,
    submissionId,
    code,
    testCases,
    timeLimitSeconds,
    memoryLimitMB,
  } = job.data;

  console.log(`submission:[${submissionId}] Starting execution...`);

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

    const result = response.Payload
      ? JSON.parse(Buffer.from(response.Payload).toString())
      : null;

    if (response.FunctionError) {
      if (result?.errorType === "Sandbox.Timedout") {
        await prisma.submission.update({
          where: { id: submissionId },
          data: {
            status: SubmissionStatus.TIME_LIMIT_EXCEEDED,
            verdict: false,
          },
        });
        return;
      }

      throw new Error(
        `Runner encountered an error\n(${response.FunctionError}): ${JSON.stringify(result)}`,
      );
    }

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

    await prisma.submission
      .update({
        where: { id: submissionId },
        data: { status: SubmissionStatus.INTERNAL_ERROR, verdict: false },
      })
      .catch(() => {});

    throw error;
  }
};
