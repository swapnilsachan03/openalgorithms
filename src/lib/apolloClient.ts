import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

export const getApolloClient = (token: string | null) => {
  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: `${import.meta.env.VITE_SERVER_URL}/graphql`,
      credentials: "same-origin",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    }),
    cache: new InMemoryCache(),
  });

  return client;
};
