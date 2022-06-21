import { gql } from "apollo-server";

export const typeDefs = gql`

type User {
    id: ID!
    email: String!
    pwd: String!
}
type Query{
    getUsers: [User]
    
}
type Subscription {
 sample: String   
}
type Mutation{
    LogIn(email: String!, pwd: String!): String!
    LogOut: String!
    SignIn(email: String!, pwd: String!): String!
    SignOut:String!
}

`
/*
type Chat{
    name:String!
    users:[User]
},
type Post{
    email : String!
    comment : String!
}
*/