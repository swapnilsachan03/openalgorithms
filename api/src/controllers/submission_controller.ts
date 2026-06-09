import _ from "lodash";
import { CreateSubmissionInput, SubmissionStatus } from "@generated/graphql";
import { GraphQLError } from "graphql";
import { Queue } from "bullmq";

import { AuthContext } from "@/src/index";
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

  await submissionsQueue.add(
    "execute",
    {
      submissionId: submission.id,
      language,
      code,
      problemId,
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
