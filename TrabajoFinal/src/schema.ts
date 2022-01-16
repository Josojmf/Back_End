import { ApolloError, ApolloServer, gql } from "apollo-server";

export const typeDefs = gql`

type User {
    id: ID!
    email: String!
    pwd: String!
    token: String
}
type Chat{
    name:String!
    user:Int!
}
type Query{
    getChats:[String]
}
type Subscription {
    postCreated(chat:String!,token:String!): Post!
   
  }
type Post{
    email : String!
    comment : String!
}



type Mutation{
    LogIn(email: String!, pwd: String!): String!
    LogOut: String!
    SignIn(email: String!, pwd: String!): User!
    SignOut:Boolean!
    createPost(email: String!, comment: String!): Post!
    quit:String
    
}

`