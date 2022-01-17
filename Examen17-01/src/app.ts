import { ApolloError,  gql } from "apollo-server";
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { Db } from "mongodb";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer } from 'http';
import * as dotenv from "dotenv";
import express from "express";
import { PubSub } from 'graphql-subscriptions';
import { Query } from "./resolvers/query";


const run = async () => {
    dotenv.config();
    const resolvers = {
      Query,
    }
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const server = new ApolloServer({
        schema,
    });
    server
  .listen(3000)
  .then(({ }) =>
    console.log(`Server is running on http://localhost:3000/graphql}`)
  );


}
try {
  run();
} catch (e) {
  console.log(e);
}