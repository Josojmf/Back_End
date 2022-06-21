import { connectDB } from "./mongo"
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { ApolloServer,ApolloError } from "apollo-server-express";
import { typeDefs } from "./schema"
import { Query } from "./resolvers/query"
import { Mutation } from "./resolvers/mutations"
import { Subscription } from "./resolvers/subscription"
export const userChat=[];
const resolvers = {
  Query,
  Mutation,
  Subscription
  };

const run = async () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const app = express();
  const httpServer = createServer(app);
  const client = await connectDB()
  const validQuery = ["Admin"]
  
  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
     async onConnect(connectionParams:any, webSocket:any, context:any) {
    },
 }, {
    server: httpServer,
    path: '/graphql',
 }
  );
  const server = new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      if (validQuery.some((q) => req.body.query.includes(q))) {
        if (req.headers['token'] != null) {
          const user = await client.collection("Users").findOne({ token: req.headers['token'] })
          if (user) {
            const token = user['token'];
            const username = user['email']
            return {
              client,
              user,
              token,
              username,
            }
          }
          else  throw new ApolloError("Something went wrong", "Bad Input", { status: 400 });
        }
        else throw new ApolloError("Not Logged In", "AUTH_ERR", { status: 403 });
      }
      else {
        return {
          client,
        }
      }
    },

    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      }
    }],
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT;
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
}
try {
  run()
} catch (e) {
  console.error(e);
}