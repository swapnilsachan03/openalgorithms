import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";

export const getApolloClient = (token: string | null) => {
  const client = new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
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
