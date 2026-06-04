import { queryResolvers } from "./query_resolvers";
import { mutationResolvers } from "./mutation_resolvers";

export const resolvers = {
  ...queryResolvers,
  ...mutationResolvers,
};
