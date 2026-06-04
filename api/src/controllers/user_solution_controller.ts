import { prisma } from "@lib/prisma";
import { GraphQLError } from "graphql";

export const getUserSolution = async (
  parent: any,
  args: { id: string; slug: string }
) => {
  const { id, slug } = args;

  if (!id && !slug) {
    throw new GraphQLError("ID must be provided.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const userSolution = await prisma.userSolution.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return userSolution;
};

export const getUserSolutionsLikes = async (parent: any) => {
  const { id } = parent;

  const likes = await prisma.userSolutionInteraction.count({
    where: { userSolutionId: id, liked: true },
  });

  return likes;
};

export const getUserSolutionsDislikes = async (parent: any) => {
  const { id } = parent;

  const dislikes = await prisma.userSolutionInteraction.count({
    where: { userSolutionId: id, liked: false },
  });

  return dislikes;
};
