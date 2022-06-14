import gql from 'graphql-tag';

export const typeDefs = gql`
type Ingredient{
  id: ID!
  name: String!
  recipes: [Recipe!]!
}
type Recipe{
  id: ID!
  name: String!
  description: String!
  ingredients: [Ingredient!]!
  author: User!
} 
type User{
  id: ID!
  mail: String!
  token: String
  recipes: [Recipe!]!
}

type Query {
  getIngredient(id:String!): Ingredient
  getRecipes(author:String,ingredient:String): [Recipe!]!
  getUser(id: String!):User
  getUsers: [User!]!
  getRecipe(id:String!) : Recipe
}

type Mutation {
  signin(email: String!, password: String!): String!
  SignOut(email:String!,password:String!):String
  login(email:String!,password:String!):String
  LogOut(email:String!,password:String!):String
  addIngredient(name:String!):Ingredient!
  deleteIngredient(id:String!):String!
  addRecipe(name:String!,description:String!,ingredients: [String!]!):Recipe
  updateRecipe(id:String!, ingredients: [String!]!):String
  deleteRecipe(id:String!):String
  
}
`
