import gql from 'graphql-tag';

const Schema = gql`
type User{
  id: ID!
  email: String!
  pwd: String!
  token: String
  recipes: [Recipe!]!
}

type Ingredient{
  id: ID!
  name: String!
  recipes: [Recipe!]!
}
type Recipe{
  id: ID
  recipe: String!
  description: String!
  ingredients: [Ingredient!]!
  author: User!
}

type Query {
  info: String!
  getRecipes(author:String,ingredient:String):[Recipe!]!
  getRecipe(id:ID!):Recipe!
  getUser(id:ID!):User!
}
input Ingredientin{
  id: ID!
  name: String!
}
input Recipein{
  id: ID
  recipe: String!
  description: String!
  ingredients: [Ingredientin!]!
  author: Userin!
}
input Userin {
  username: String!
  password: String!
}

type Mutation {
  signin(email: String!, password: String!): String!
  signout(email:String!,password:String!):String
  login(email:String!,password:String!):String
  logout(email:String!,password:String!):String
  addIngredient(id:ID!,name:String!,token:String!,email:String!):Ingredient!
  deleteIngredient(name:String!,token:String!,email:String!):String!
  addRecipe(recipe:String!,ingredients:[String!]!,email:String!,token:String!):Recipe!
  
}
`
export{Schema}