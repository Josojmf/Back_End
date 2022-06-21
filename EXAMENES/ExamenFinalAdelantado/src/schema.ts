import gql from 'graphql-tag';

export const typeDefs = gql`

type Character{
    id: String!
    name: String!
    status: String!
    species: String!
    episode: [Episode!]!
  }
type Episode{
    name: String!
    episode: String!
  }

type Query{
characters :[Character!]!
character(id:String!):Character!
charactersByIds(ids:[Int]!):[Character!]
}

`