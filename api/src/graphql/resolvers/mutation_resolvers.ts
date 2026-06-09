import {
  createProblem,
  deleteProblem,
  updateProblem,
} from "@controllers/problem_controller";

import {
  likeDislikeProblem,
  updateProfile,
} from "@controllers/user_controller";

import {
  createTopic,
  deleteTopic,
  updateTopic,
} from "@controllers/topic_controller";

import { createSubmission } from "@controllers/submission_controller";

export const mutationResolvers = {
  Mutation: {
    updateProfile,
    createProblem,
    updateProblem,
    deleteProblem,
    createTopic,
    updateTopic,
    deleteTopic,
    likeDislikeProblem,
    createSubmission,
  },
};
