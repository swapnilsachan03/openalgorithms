import { gql } from "@apollo/client";

export const createSubmissionMutation = gql`
  mutation CreateSubmission($input: CreateSubmissionInput) {
    createSubmission(input: $input) {
      id
      userId
      problemId
      code
      status
      createdAt
      language
      user {
        email
      }
      verdict
    }
  }
`;
