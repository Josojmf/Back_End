import { gql } from "apollo-server";

export const typeDefs = gql`

type Match {
    equipo1: String
    equipo2: String
    resultado:String,
    minuto_de_juego:Int
    finalizado:Boolean
}
type Query{
    listMatches: [Match!]!
    getMatch(id:String!): Match!
    
}
type Subscription {
    subscribeMatch(id:String!):Match!  
}
type Mutation{
    setMatchData(id: ID!, result: String, minute: Int, ended: Boolean):String!
    startMatch (equipo1: String!, equipo2: String!) : String!
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