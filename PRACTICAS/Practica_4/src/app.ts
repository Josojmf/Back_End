import { isNamedExportBindings } from "typescript";
import { connectDB } from "./DBConnect"
import  { ApolloServer } from 'apollo-server';
import { Collection, Db, MongoClient } from "mongodb";
import {Usuario} from "./types"; 
import { v4 as uuid } from "uuid";
import { typeDefs } from "./schema"
const dotenv = require('dotenv');
dotenv.config();
const  Mutation  =require ("./Mutation");
const  Query  =require ("./Query");
const Recipe = require("./Chained/Recipe")
const User = require("./Chained/User")
const Ingredient = require("./Chained/Ingredient")


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
          const user = await client.collection("Users").findOne({ token: req.headers['token'] }) as unknown as  Usuario;
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