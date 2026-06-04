import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { resolvers } from "@graphql/resolvers";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";

import authRoutes from "@routes/auth_routes";

const app = express();
const httpServer = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

export interface AuthContext {
  token?: string;
}

const typeDefs = mergeTypeDefs(
  loadSchemaSync("src/graphql/schema/schema.graphql", {
    loaders: [new GraphQLFileLoader()],
  })
);

const apolloServer = new ApolloServer<AuthContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await apolloServer.start();

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      return { token: req.headers.authorization?.split(" ")[1] };
    },
  })
);

const port = process.env.PORT || 4000;

httpServer.listen(port, () => {
  console.log("Server running on port " + port);
});
