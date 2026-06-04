import _ from "lodash";
import { GraphQLError } from "graphql";

import { prisma } from "@lib/prisma";
import { validateSessionToken } from "@utils/auth_utils";
import {
  CreateTopicInput,
  Problem,
  UpdateTopicInput,
} from "@generated/graphql";
import { AuthContext } from "@/src";

export const getTopics = async () => {
  const topics = await prisma.topic.findMany();
  return topics;
};

export const getProblemTopics = async (parent: Problem) => {
  const { id } = parent;

  const problemTopics = await prisma.topic.findMany({
    where: {
      problems: { some: { problemId: id } },
    },
  });

  return problemTopics;
};

export const createTopic = async (
  parent: unknown,
  args: { input: CreateTopicInput },
  contextValue: AuthContext
) => {
  const { token } = contextValue;

  if (_.isNil(token)) {
    throw new GraphQLError("You must be logged in to create a new topic", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const sessionRes = await validateSessionToken(token);

  if (!sessionRes?.user || sessionRes.user.role !== "ADMIN") {
    throw new GraphQLError("You are not authorized for this operation", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }

  const { name, slug, description } = args.input;

  const problem = await prisma.topic.create({
    data: {
      name,
      slug,
      description,
    },
  });

  return problem;
};

export const updateTopic = async (
  parent: unknown,
  args: { input: UpdateTopicInput },
  contextValue: AuthContext
) => {
  const { token } = contextValue;

  if (_.isNil(token)) {
    throw new GraphQLError("You must be logged in to update a topic", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const sessionRes = await validateSessionToken(token);

  if (!sessionRes?.user || sessionRes.user.role !== "ADMIN") {
    throw new GraphQLError("You are not authorized for this operation", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }

  const { id, name, slug, description } = args.input;

  const topic = await prisma.topic.update({
    where: { id },
    data: {
      name,
      slug,
      description,
    },
  });

  return topic;
};

export const deleteTopic = async (
  parent: unknown,
  args: { id: string },
  contextValue: AuthContext
) => {
  const { token } = contextValue;

  if (_.isNil(token)) {
    throw new GraphQLError("You must be logged in to delete a topic", {
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

  const topic = await prisma.topic.delete({
    where: { id },
  });

  return { isSuccess: !!topic, message: "Topic deleted successfully" };
};
