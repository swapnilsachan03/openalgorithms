import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

export const client = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "same-origin",
    headers: {
      authorization: "req.header('Cookie')",
    },
  }),
  cache: new InMemoryCache(),
});
