import { ApolloError,  gql } from "apollo-server";
import { execute, subscribe, SubscriptionArgs } from 'graphql';
import { ApolloServer } from "apollo-server-express";
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "./mongo";
import { typeDefs } from "./schema";
import { Mutation} from "./resolvers/mutations";
import { Subscription} from "./resolvers/subscription";
import { Db } from "mongodb";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer } from 'http';
import * as dotenv from "dotenv";
import express from "express";
import { PubSub } from 'graphql-subscriptions';
import { Query } from "./resolvers/query";
const pubsub = new PubSub();
//let chat:any;
const resolvers = {
  Mutation,
  Query,
  Subscription :{
    postCreated: {
      subscribe:(chat:SubscriptionArgs)=> pubsub.asyncIterator(chat.contextValue)
    },
  },
}

const run = async () => {
  
    console.log("Connecting to DB...");
    const db:Db = await connectDB();
    console.log("Connected to database");
    const users =await db.collection("Users");
    const chats =await db.collection("Chats");
    dotenv.config();
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const app = express();
    const httpServer = createServer(app);
    const subscriptionServer = SubscriptionServer.create({
      schema,
      execute,
      subscribe,
      onConnect(connectionParams:any, webSocket:any, context:({chats:string})) {
        //console.log("hewoo")
      },
   }, {
      server: httpServer,
      path: '/graphql',
   });
    const server = new ApolloServer({
        schema,
        context: async ({ req, res }) => {// como app. use??? recibe el request , donde me llegan los headers y todo lo que pase
          
            return{
                token:req.headers.token,
                usersDb:users,
                chats:req.headers.chats,
                pubsub:pubsub,
                subscriptionServer:subscriptionServer
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
  httpServer.listen(3000, () =>
  console.log(`Server is now running on http://localhost:3000/graphql`)
);
  
}

try {
    run();
} catch (e) {
    console.log(e);
}

