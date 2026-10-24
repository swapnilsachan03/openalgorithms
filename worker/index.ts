import "dotenv/config";

import { Worker } from "bullmq";
import { redis } from "@lib/redis";
import { LambdaClient } from "@aws-sdk/client-lambda";

import { processSubmission } from "./processors/submission";
import { processCodeRun } from "./processors/code_run";

export const RUNNER_FUNCTIONS: Record<string, string> = {
  python: "openalgorithms-python-runner",
  cpp: "openalgorithms-cpp-runner",
  java: "openalgorithms-java-runner",
  javascript: "openalgorithms-node-runner",
};

export const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION,
});

const submissionWorker = new Worker(
  "submissions",
  async (job) => {
    await processSubmission(job);
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

const codeRunWorker = new Worker(
  "code_runs",
  async (job) => {
    await processCodeRun(job);
  },
  {
    connection: redis,
    concurrency: 5,
  },
);
