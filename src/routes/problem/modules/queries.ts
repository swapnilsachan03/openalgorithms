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
        problemId
      }
      solutions {
        code
        createdAt
        id
        language
        problemId
      }
      userSolutions {
        authorId
        content
        dislikes
        likes
        id
      }
      hints {
        id
        content
        problemId
      }
      topics
      editorial {
        id
        content
        problemId
        views
        likes
        dislikes
        createdAt
        updatedAt
      }
      discussions {
        id
        content
        parent {
          id
        }
        user {
          id
          name
        }
      }
      createdBy {
        id
        name
        email
      }
    }
  }
`;
