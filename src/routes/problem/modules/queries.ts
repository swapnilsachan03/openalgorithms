import { gql } from "@apollo/client";

export const getProblemBySlugQuery = gql`
  query getProblemBySlug($slug: String) {
    problem(slug: $slug) {
      id
      title
      slug
      description
      createdById
      timeLimitInSeconds
      memoryLimitInMB
      views
      acceptedSubmissions
      totalSubmissions
      difficulty
      likes
      dislikes
      bookmarks
      examples {
        id
        input
        output
        explanation
      }
      userSolutions {
        id
        title
        views
        likes
        dislikes
        user {
          id
          name
        }
      }
      hints {
        id
        content
        problemId
      }
      topics {
        id
      }
      editorial {
        id
        title
        content
        views
        likes
        dislikes
        createdAt
        updatedAt
      }
    }
  }
`;

export const getSolutionByIdQuery = gql`
  query getSolutionById($id: ID!) {
    solution(id: $id) {
      id
      title
      content
      language
      createdAt
      likes
      dislikes
      views
      user {
        id
        name
      }
    }
  }
`;
