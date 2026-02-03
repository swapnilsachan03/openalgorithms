import { gql } from "@apollo/client";

export const getTopicsQuery = gql`
  query getTopics {
    topics {
      id
      name
    }
  }
`;
