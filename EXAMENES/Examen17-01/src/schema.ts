import { ApolloError, ApolloServer, gql } from "apollo-server";

export const typeDefs = gql`
type Character {
  id: ID
  name: String
  status: String
  species: String
  type: String
  gender: String
  origin: Location
  location: Location
  image: String
  episode: [Episode]!
  created: String
  }
  type Characters {
    info: Info
    results: [Character]
  }
  type Episode {
    id: ID
    name: String
    air_date: String
    episode: String
    characters: [Character]!
    created: String
  }
  type Info {
    count: Int
    pages: Int
    next: Int
    prev: Int
  }
  
  type Location {
    id: ID
    name: String
    type: String
    dimension: String
    residents: [Character]!
    created: String
  }
  
  type Locations {
    info: Info
    results: [Location]
  }
  
  type Episodes {
    info: Info
    results: [Episode]
  }
type Query{
    characters:Characters
    character(id:ID!):Character
    charactersByIds(ids: [ID!]!): [Character]
    
}


type Mutation{
    set:String
    
}

`