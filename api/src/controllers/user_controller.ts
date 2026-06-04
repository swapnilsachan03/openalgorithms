import _ from "lodash";
import { GraphQLError } from "graphql";

import { prisma } from "@lib/prisma";
import { User } from "@prisma/client";

import { validateSessionToken } from "@utils/auth_utils";
import { AuthContext } from "@/src/index";

import { LikeDislikeInput } from "@generated/graphql";

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const getUser = async (parent: unknown, args: { id: string }) => {
  const { id } = args;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (user === null) {
    throw new GraphQLError("User not found", {
      extensions: { code: "USER_NOT_FOUND" },
    });
  }

  return user;
};

export const getProfile = async (
  parent: unknown,
  args: unknown,
  contextValue: AuthContext
) => {
  const { token = "token" } = contextValue;

  const sessionRes = await validateSessionToken(token);

  if (!sessionRes?.user) {
    throw new GraphQLError("Failed to fetch profile, invalid token!", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  return sessionRes.user;
};

export const getUserSessions = async (parent: User) => {
  const { id } = parent;

  const sessions = await prisma.session.findMany({
    where: {
      userId: id,
    },
  });

  return sessions;
};

export const updateProfile = async (
  parent: unknown,
  args: {
    input: {
      id: string;
      name: string;
      image: string;
    };
  }
) => {
  const { id, name, image } = args.input;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (user === null) {
    throw new GraphQLError("User not found", {
      extensions: { code: "USER_NOT_FOUND" },
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      image,
    },
  });

  return updatedUser;
};

export const deleteProfile = async (
  parent: unknown,
  args: { userId: string },
  contextValue: unknown,
  info: AuthContext
) => {
  const { userId } = args;
  const { token } = info;

  if (!userId || !token) {
    throw new GraphQLError("You are not authorized for this operation", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const sessionRes = await validateSessionToken(token);

  if (sessionRes?.user?.id !== userId) {
    throw new GraphQLError("Invalid user ID", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user === null) {
    throw new GraphQLError("User not found", {
      extensions: { code: "USER_NOT_FOUND" },
    });
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return {
    isSuccess: true,
    message: "User deleted successfully",
  };
};

export const likeDislikeProblem = async (
  parent: unknown,
  args: { input: LikeDislikeInput },
  contextValue: AuthContext
) => {
  const { token } = contextValue;

  if (_.isNil(token)) {
    throw new GraphQLError("You must be logged in to like / dislike problems", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const sessionRes = await validateSessionToken(token);

  if (!sessionRes?.user) {
    throw new GraphQLError("Invalid token, user not found", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const { id } = sessionRes.user;
  const { entityId, like } = args.input;

  const problem = await prisma.problem.findUnique({
    where: {
      id: entityId,
    },
    select: {
      id: true,
    },
  });

  if (problem === null) {
    throw new GraphQLError("Problem not found", {
      extensions: { code: "PROBLEM_NOT_FOUND" },
    });
  }

  let interaction = await prisma.problemInteraction.findUnique({
    where: {
      userId_problemId: {
        userId: id,
        problemId: entityId,
      },
    },
  });

  if (interaction) {
    interaction = await prisma.problemInteraction.update({
      where: {
        userId_problemId: {
          userId: id,
          problemId: entityId,
        },
      },
      data: {
        like,
      },
    });
  } else {
    interaction = await prisma.problemInteraction.create({
      data: {
        userId: id,
        problemId: entityId,
        like,
      },
    });
  }

  return { isSuccess: true, message: "Interaction updated successfully" };
};
