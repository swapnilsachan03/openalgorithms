import { gql } from "@apollo/client";

export const getProblemsQuery = gql`
  query getProblems($filters: GetAllProblemsFilterInput) {
    problems(filters: $filters) {
      pageInfo {
        currentPage
        fetchedCount
        hasNextPage
        totalCount
        totalPages
      }
      edges {
        id
        title
        slug
        likes
        dislikes
        bookmarks
        topics
        totalSubmissions
        acceptedSubmissions
        views
      }
    }
  }
`;
