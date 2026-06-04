import { gql } from "@apollo/client";

export const createProblemMutation = gql`
  mutation CreateProblem($input: CreateProblemInput) {
    createProblem(input: $input) {
      id
      title
      slug
    }
  }
`;

export const updateProblemMutation = gql`
  mutation UpdateProblem($input: UpdateProblemInput) {
    updateProblem(input: $input) {
      id
      title
      slug
    }
  }
`;
