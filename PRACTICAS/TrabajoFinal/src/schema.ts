import { gql } from "apollo-server";

export const typeDefs = gql`

type User {
    id: ID!
    email: String!
    pwd: String!
    chats: [Chat]
}
type Chat{
    name:String!
    users:[User]
}
type Query{
    getChats:[Chat]
}
type Subscription {
    Join(sala:String!):Post
  }

type Post{
    email : String!
    comment : String!
}

type Mutation{
    LogIn(email: String!, pwd: String!): String!
    LogOut: String!
    SignIn(email: String!, pwd: String!): String!
    SignOut:String!
    SendMessage(email: String!, comment: String!): String!
    Quit:String 
}

`