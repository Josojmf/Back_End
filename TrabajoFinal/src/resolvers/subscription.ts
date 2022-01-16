import { ApolloError } from 'apollo-server-errors';
import { Collection, Db, ObjectId } from "mongodb";
import { User } from "../types";
import { v4 as uuidv4 } from "uuid";
const brcypt = require("bcrypt");
import * as dotenv from "dotenv";
import { PubSub } from 'graphql-subscriptions';
import { subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

dotenv.config();
export const Subscription ={
    postCreated:async(context: {pubsub:PubSub,chat:string}) => {
        return context.pubsub.asyncIterator([context.chat])
    }
           

    }
