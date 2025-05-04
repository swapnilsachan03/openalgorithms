import { gql } from "@apollo/client";

export const getAllTopicsQuery = gql`
  query getAllTopics {
    topics {
      id
      name
    }
  }
`;
