import _ from "lodash";
import {
  CreateSubmissionInput,
  SubmissionsFiltersInput,
  SubmissionStatus,
} from "@generated/graphql";
import { GraphQLError } from "graphql";
import { Queue } from "bullmq";

import { AuthContext } from "@/index";
import { validateSessionToken } from "@utils/auth_utils";

import { prisma } from "@lib/prisma";

const submissionsQueue = new Queue("submissions", {
  connection: {
    url: process.env.REDIS_URL as string,
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    enableReadyCheck: false,
  },
});

export const createSubmission = async (
  parent: unknown,
  args: { input: CreateSubmissionInput },
  contextValue: AuthContext
) => {
  const { token } = contextValue;

  const sessionRes = token ? await validateSessionToken(token) : null;

  if (_.isNil(token) || !sessionRes?.user) {
    throw new GraphQLError("You must be logged in to submit", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const { problemId, code, language } = args.input;

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
  });

  if (_.isNull(problem?.id)) {
    throw new GraphQLError("Trying to submit solution to an invalid problem", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const submission = await prisma.submission.create({
    data: {
      userId: sessionRes?.user.id,
      problemId,
      code,
      language,
      status: SubmissionStatus.Pending,
    },
  });

  const testCases = await prisma.testcase.findMany({
    where: {
      problemId,
    },
  });

  await submissionsQueue.add(
    "execute",
    {
      submissionId: submission.id,
      language,
      code,
      problemId,
      testCases,
      timeLimitSeconds: problem.timeLimitInSeconds,
      memoryLimitMB: problem.memoryLimitInMB,
    },
    {
      attempts: 2,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  return submission;
};

export const getSubmission = async (parent: unknown, args: { id: string }) => {
  const { id } = args;

  const submission = await prisma.submission.findUnique({
    where: { id },
  });

  if (submission === null) {
    throw new GraphQLError("Submission not found", {
      extensions: { code: "RESOURCE_NOT_FOUND" },
    });
  }

  return submission;
};

export const getSubmissions = async (
  parent: unknown,
  args: { filters: SubmissionsFiltersInput }
) => {
  const { userId, problemId } = args.filters;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new GraphQLError("User does not exist", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  if (problemId) {
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { id: true },
    });

    if (!problem) {
      throw new GraphQLError("Problem does not exist", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
  }

  const submissions = await prisma.submission.findMany({
    where: { userId, ...(problemId ? { problemId } : {}) },
  });

  return submissions;
};
