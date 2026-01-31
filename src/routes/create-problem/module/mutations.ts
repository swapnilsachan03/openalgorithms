import { gql } from "@apollo/client";

export const createProblemMutation = gql`
  mutation CreateProblem($input: CreateProblemInput) {
    createProblem(input: $input) {
      id
      title
      slug
      description
      createdById
      timeLimitInSeconds
      memoryLimitInMB
      difficulty
      editorial {
        id
        content
      }
      examples {
        input
        output
        explanation
      }
      hints {
        content
      }
      topics {
        id
      }
    }
  }
`;
