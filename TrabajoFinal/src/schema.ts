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
    getChats: [Chat]
}
type Subscription {
    postCreated(chat:String!): Post!
  }
type Post{
    email : String!
    comment : String!
}

type Query{
    getUser(id: String!): User
    getUsers:[User]!
}

type Mutation{
    LogIn(email: String!, pwd: String!): Boolean!
    LogOut: String
    SignIn(email: String!, pwd: String!): User!
    SignOut:Boolean!
    createPost(email: String!, comment: String!): Post!
}

`