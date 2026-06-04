import {
  createProblem,
  createSubmission,
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
