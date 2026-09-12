import { gql } from "@apollo/client";

export const getUserSubmissionsQuery = gql`
  query getUserSubmissions($filters: SubmissionsFiltersInput!) {
    submissions(filters: $filters) {
      id
      language
      status
      code
      createdAt
      maxMemoryMb
      maxRuntimeMs
    }
  }
`;

export const getSubmissionByIdQuery = gql`
  query getSubmissionById($id: ID!) {
    id
    language
    status
    code
    createdAt
    maxMemoryMb
    maxRuntimeMs
  }
`;
