import { prisma } from "@lib/prisma";
import { SubmissionStatus } from "@/prisma/generated/prisma/enums";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { lambdaClient, RUNNER_FUNCTIONS } from "..";

type RunData = {
  runId: string;
  code: string;
  solution: string;
  language: string;
  input: string;
  timeLimitSeconds: number;
  memoryLimitMB: number;
};

export const processCodeRun = async (job: { data: RunData }) => {
  const {
    runId,
    code,
    solution,
    language,
    input,
    timeLimitSeconds,
    memoryLimitMB,
  } = job.data;

  console.log(`[run:${runId}] Starting execution...`);

  try {
    await prisma.codeRun.update({
      where: { id: runId },
      data: { status: SubmissionStatus.JUDGING },
    });

    const functionName = RUNNER_FUNCTIONS[language.toLowerCase()];

    if (!functionName) {
      throw new Error(
        `No runner configured for language: ${language.toLowerCase()}`,
      );
    }

    const command = new InvokeCommand({
      FunctionName: functionName,
      InvocationType: "RequestResponse",
      Payload: Buffer.from(
        JSON.stringify({
          mode: "run",
          runId,
          code,
          solution,
          input,
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
        await prisma.codeRun.update({
          where: { id: runId },
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

    await prisma.codeRun.update({
      where: { id: runId },
      data: {
        status,
        maxMemoryMb,
        maxRuntimeMs,
        verdict: status === SubmissionStatus.ACCEPTED,
      },
    });
  } catch (error) {
    console.error(`[run:${runId}] Failed to run Lambda task: `, error);

    await prisma.codeRun
      .update({
        where: { id: runId },
        data: { status: SubmissionStatus.INTERNAL_ERROR, verdict: false },
      })
      .catch(() => {});

    throw error;
  }
};
