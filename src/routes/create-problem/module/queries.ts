import { gql } from "@apollo/client";

export const getTopicsQuery = gql`
  query getTopics {
    topics {
      id
      name
    }
  }
`;

export const getProblemBySlugQuery = gql`
  query getProblemBySlug($slug: String) {
    problem(slug: $slug) {
      id
      title
      slug
      description
      timeLimitInSeconds
      memoryLimitInMB
      difficulty
      hints {
        id
        content
      }
      topics {
        id
        name
      }
      examples {
        id
        input
        output
        explanation
      }
      testcases {
        id
        input
        output
      }
      editorial {
        id
        title
        content
      }
    }
  }
`;
