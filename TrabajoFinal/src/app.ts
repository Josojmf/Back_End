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
import {GraphQLServer} from "graphql-yoga"
const pubsub = new PubSub();
let activeChats= new Map<string,number>();


const run = async () => {
  
    console.log("Connecting to DB...");
    const db:Db = await connectDB();
    console.log("Connected to database");
    const users =await db.collection("Users");
    const chats =await db.collection("Chats");
    dotenv.config();
    const resolvers = {
      Mutation,
      Query,
      Subscription :{
        postCreated: {
          subscribe:async (parent:any,args:any, context:{chat:string,pubsub:PubSub,token:string})=>{ 
            if(Auth(args.token,process.env.TOKEN as string)==false){
              throw new ApolloError('Not Logged In', 'MY_ERROR_CODE');
          }
            if(activeChats.has(args.chat)==false){
              activeChats.set(args.chat,1);
            }else{
              let nUsers=activeChats.get(args.chat);
              activeChats.set(args.chat,nUsers!+1)
            }
            users.updateOne({token:args.token}, {$set:{chat:args.chat}})
            return pubsub.asyncIterator(args.chat)
          } 
        },
        quit:{
          unsubscribeAll:(parent:any,args:any,context:any)=>{
            return pubsub.asyncIterator("EXIT")
          }
        }
      },
    }
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const app = express();
    const httpServer = createServer(app);
   const subscriptionServer = SubscriptionServer.create({
      schema,
      execute,
      subscribe,
      onConnect(connectionParams:any, webSocket:any, context:({chats:string})) {
      },
   }, {
      server: httpServer,
      path: '/graphql',
   });
    const server = new ApolloServer({
        schema,
        context: async ({ req, res }) => {// como app. use??? recibe el request , donde me llegan los headers y todo lo que pase
            pubsub;
            return{
                token:req.headers.token,
                usersDb:users,
                chats:req.headers.chats,
                pubsub:pubsub,
                subscriptionServer:subscriptionServer,
                activeChats:activeChats
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
  httpServer.listen(process.env.PORT, () =>
  console.log(`Server is now running on http://localhost:${process.env.PORT}/graphql`)
);
  
}

try {
    run();
} catch (e) {
    console.log(e);
}

const Auth = (contra: string, token: string) => {
  if(contra === token) {
      return true;
  }else{
      return false;
  }
}