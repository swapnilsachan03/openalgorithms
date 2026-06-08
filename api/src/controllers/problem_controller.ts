import _ from "lodash";
import { Problem } from "@generated/graphql";
import { GraphQLError } from "graphql";

import { prisma } from "@lib/prisma";
import { validateSessionToken } from "@utils/auth_utils";
import { AuthContext } from "@/src/index";

import {
  CreateProblemInput,
  CreateSubmissionInput,
  GetAllProblemsFilterInput,
  UpdateProblemInput,
} from "@generated/graphql";

export const createProblem = async (
  parent: unknown,
  args: { input: CreateProblemInput },
  contextValue: AuthContext
) => {
  const { token } = contextValue;

  if (_.isNil(token)) {
    throw new GraphQLError("You must be logged in to add problems", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const sessionRes = await validateSessionToken(token);

  if (!sessionRes?.user || sessionRes.user.role !== "ADMIN") {
    throw new GraphQLError("You are not authorized for this operation", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }

  const {
    title,
    slug,
    description,
    timeLimitInSeconds,
    memoryLimitInMB,
    difficulty,
    examples,
    solutions,
    hints,
    topics,
    editorial,
    testcases,
  } = args.input;

  const hintsInput = _.map(hints, content => ({ content }));
  const topicsInput = _.map(topics, topicId => ({ topicId }));

  const problem = await prisma.problem.create({
    data: {
      title,
      slug,
      description,
      createdById: sessionRes.user.id,
      timeLimitInSeconds,
      memoryLimitInMB,
      difficulty,
      examples: {
        create: examples,
      },
      ...(solutions
        ? {
            solutions: {
              create: solutions,
            },
          }
        : {}),
      hints: { createMany: { data: hintsInput } },
      testcases: { createMany: { data: testcases } },
      topics: {
        createMany: { data: topicsInput },
      },
      ...(editorial
        ? {
            editorial: {
              create: editorial,
            },
          }
        : {}),
    },
  });

  return problem;
};

export const updateProblem = async (
  parent: unknown,
  args: { input: UpdateProblemInput },
  contextValue: AuthContext
) => {
  const { token } = contextValue;

  if (_.isNil(token)) {
    throw new GraphQLError("You must be logged in to update problems", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const sessionRes = await validateSessionToken(token);

  if (!sessionRes?.user || sessionRes.user.role !== "ADMIN") {
    throw new GraphQLError("You are not authorized for this operation", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }

  const {
    id,
    title,
    slug,
    description,
    timeLimitInSeconds,
    memoryLimitInMB,
    difficulty,
    examples,
    solutions,
    hints,
    topics,
    testcases,
  } = args.input;

  const hintsInput = _.map(hints, content => ({ content }));
  const topicsInput = _.map(topics, topicId => ({ topicId }));

  const addedTestcases = testcases?.addedTestcases ?? [];
  const updatedTestcases = testcases?.updatedTestcases ?? [];
  const deletedTestcases = testcases?.deletedTestcases ?? [];

  const problem = await prisma.problem.update({
    where: { id },
    data: {
      ...(title ? { title } : {}),
      ...(slug ? { slug } : {}),
      ...(description ? { description } : {}),
      ...(timeLimitInSeconds ? { timeLimitInSeconds } : {}),
      ...(memoryLimitInMB ? { memoryLimitInMB } : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(examples
        ? {
            examples: {
              deleteMany: {},
              create: examples,
            },
          }
        : {}),
      ...(solutions
        ? {
            solutions: {
              create: solutions,
            },
          }
        : {}),
      hints: {
        deleteMany: {},
        createMany: { data: hintsInput },
      },
      topics: {
        deleteMany: {},
        createMany: { data: topicsInput },
      },
      testcases: {
        createMany: { data: addedTestcases },
        deleteMany: {
          id: { in: deletedTestcases },
        },
        update: _.map(updatedTestcases, tc => ({
          where: { id: tc.id },
          data: {
            input: tc.input,
            output: tc.output,
          },
        })),
      },
    },
  });

  return problem;
};

export const deleteProblem = async (
  parent: unknown,
  args: { id: string },
  contextValue: AuthContext
) => {
  const { token } = contextValue;

  if (_.isNil(token)) {
    throw new GraphQLError("You must be logged in to delete problems", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const sessionRes = await validateSessionToken(token);

  if (!sessionRes?.user || sessionRes.user.role !== "ADMIN") {
    throw new GraphQLError("You are not authorized for this operation", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }

  const { id } = args;

  const problem = await prisma.problem.delete({
    where: { id },
  });

  return { isSuccess: !!problem, message: "Problem deleted successfully" };
};

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
      code,
      problemId,
      language,
      status: "PENDING",
    },
  });

  return submission;
};

export const getProblem = async (
  parent: unknown,
  args: { id: string; slug: string }
) => {
  const { id, slug } = args;

  if (!id && !slug) {
    throw new GraphQLError("Either 'id' or 'slug' must be provided.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const problem = await prisma.problem.update({
    where: id ? { id } : { slug },
    data: { views: { increment: 1 } },
  });

  return problem;
};

export const getAllProblems = async (
  parent: unknown,
  args: {
    filters: GetAllProblemsFilterInput;
  }
) => {
  const filters = args.filters || {};

  const { skip = 0, take = 10, search = "", difficulty, topics } = filters;

  const whereClause = {
    ...(search ? { title: { contains: search } } : {}),
    ...(difficulty ? { difficulty: { equals: difficulty } } : {}),
    ...(topics ? { topics: { some: { topicId: { in: topics } } } } : {}),
  };

  const [problems, totalCount] = await Promise.all([
    prisma.problem.findMany({
      skip,
      take,
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.problem.count(),
  ]);

  return {
    edges: problems,
    pageInfo: {
      totalCount,
      fetchedCount: problems.length,
      hasNextPage: skip + take < totalCount,
      currentPage: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(totalCount / take),
    },
  };
};

export const getProblemCreatedBy = async (parent: Problem) => {
  const { createdById } = parent;

  if (!createdById) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: createdById },
  });

  return user;
};

export const getProblemLikes = async (parent: Problem) => {
  const { id } = parent;

  const likes = await prisma.problemInteraction.count({
    where: { problemId: id, like: true },
  });

  return likes;
};

export const getProblemDislikes = async (parent: Problem) => {
  const { id } = parent;

  const dislikes = await prisma.problemInteraction.count({
    where: { problemId: id, like: false },
  });

  return dislikes;
};

export const getProblemBookmarksCount = async (parent: Problem) => {
  const { id } = parent;

  const bookmarks = await prisma.bookmarkedProblem.count({
    where: { problemId: id },
  });

  return bookmarks;
};

export const getProblemExamples = async (parent: Problem) => {
  const { id } = parent;

  const examples = await prisma.example.findMany({
    where: { problemId: id },
  });

  return examples;
};

export const getProblemSolutions = async (parent: Problem) => {
  const { id } = parent;

  const solutions = await prisma.solution.findMany({
    where: { problemId: id },
  });

  return solutions;
};

export const getProblemUserSolutions = async (parent: Problem) => {
  const { id } = parent;

  const solutions = await prisma.userSolution.findMany({
    where: { problemId: id },
  });

  return solutions;
};

export const getProblemHints = async (parent: Problem) => {
  const { id } = parent;

  const hints = await prisma.hint.findMany({
    where: { problemId: id },
  });

  return hints;
};

export const getProblemEditorial = async (parent: Problem) => {
  const { id } = parent;

  const editorial = await prisma.editorial.findUnique({
    where: { problemId: id },
  });

  return editorial;
};

export const getProblemDiscussions = async (parent: Problem) => {
  const { id } = parent;

  const discussions = await prisma.discussion.findMany({
    where: { problemId: id },
  });

  return discussions;
};

export const getProblemTestcases = async (parent: Problem) => {
  const { id } = parent;

  const testcases = await prisma.testcase.findMany({
    where: { problemId: id },
  });

  return testcases;
};
