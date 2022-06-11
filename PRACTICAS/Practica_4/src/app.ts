import { isNamedExportBindings } from "typescript";
import { connectDB } from "./DBConnect"
import  { ApolloServer } from 'apollo-server';
import { Collection, Db, MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";
const dotenv = require('dotenv');
import {Usuario} from "./types";

import { typeDefs } from "./schema"
dotenv.config();
const  Mutation  =require ("./Mutation");
const Query =require("./Query")

const resolvers = {
  Query,
  Mutation,
}

const run = async () => {
  const client = await connectDB();
  const validQuery = ["SignOut", "LogOut", "addIngredient", "deleteIngredient", "addRecipe", "updateRecipe", "deleteRecipe"]
   const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      if (validQuery.some((q) => req.body.query.includes(q))) {
        if (req.headers.token != null) {
          const user = await client.collection("ActiveUsers").findOne({ token: req.headers.token });
          if (user) {
            return {
              client,
              user,
            }
          }
          else res.sendStatus(403);
        }
        else res.sendStatus(403);
      }
      else {
        return {
          client,
        }
      }
    },
  });
  server.listen(4000).then(() => {
    console.log(`🚀  Server ready on 4000 `);
  });
} 
try {
  run()
} catch (e) {
  console.error(e);
}