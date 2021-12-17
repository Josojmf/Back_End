import { isNamedExportBindings } from "typescript";
import  { ApolloServer } from 'apollo-server';
import { Collection, Db, MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";
import { Schema } from "./schema";
const dotenv = require('dotenv');
dotenv.config();
const  Mutation  =require ("./Mutation");
const Query =require("./Query")

const resolvers = {
  Query,
  Mutation,
}
// 3
const fs = require('fs');
const path = require('path');

const server = new ApolloServer({
  typeDefs:  Schema,
  resolvers,
})
server
  .listen(process.env.PORT)
  .then(({ }) =>
    console.log(`Server is running on ${process.env.PORT}`)
  );
