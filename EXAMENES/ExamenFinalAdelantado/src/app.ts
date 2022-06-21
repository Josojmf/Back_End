
import  { ApolloServer } from 'apollo-server';
const dotenv = require('dotenv');
import { typeDefs } from "./schema"
const  Query  =require ("./Query")
dotenv.config();
const resolvers = {
  Query
}
const run = async () => {
   const server = new ApolloServer({
    typeDefs,
    resolvers,
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