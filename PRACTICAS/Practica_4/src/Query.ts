import { ApolloError } from "apollo-server";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { idText } from "typescript";
import { v4 as uuid } from "uuid";
import{typeDefs} from "./schema"
import { Receta, Usuario } from "./types";
export async function  getRecipes(parent: any, args: { author: string, ingredient: string }, context: { client: Db })  {
    if (args.author != null) {
      const recipes_author = await context.client.collection("Recipes").find({ author: args.author }).toArray();
      const authorSearch= await context.client.collection("Users").findOne({_id:new ObjectId(args.author)});
      if(authorSearch){
        const author_complete ={...authorSearch}
        if (recipes_author.length != 0) {
            return recipes_author.map(r => ({
                ...r,
                ingredients: r.ingredients.map(async function(i:any){
                  return await context.client.collection("Ingredients").findOne({ name:i})
                }),
                id: r._id.toString(),
                author: {
                    ...author_complete,
                    recipes: recipes_author.map(r=> ({
                        ...r,
                        ingredients: r.ingredients.map(async function(i:any){
                          return await context.client.collection("Ingredients").findOne({ name:i})
                        })
                    }))
                }
            }))
          }
          else {
            throw new ApolloError("Something went wrong", "Bad Input", { status: 403 });
          }
        }
      }

     
    else if (args.ingredient != null) {
      const recipes_ingredient = await context.client.collection("Recipes").find({ ingredients: args.ingredient }).toArray()
      const authors_found=recipes_ingredient.map(function(r){
        return r.author
      });
      if (recipes_ingredient.length != 0) {
       const comp_auth= authors_found.map( async function(a){
           //console.log( await context.client.collection("Users").findOne({_id:new ObjectId(a)}))
       })
       recipes_ingredient.map(async r => (
        console.log(await context.client.collection("Users").findOne({_id:new ObjectId(r.author)}))
       ))

         return recipes_ingredient.map(async r => ({
                ...r,
                ingredients: r.ingredients.map(async function(i:any){
                  return await context.client.collection("Ingredients").findOne({ name:i})
                }),
                id: r._id.toString(),
                author: await context.client.collection("Users").findOne({_id:new ObjectId(r.author)})
                
              }))
            

   
    }
      
      else {
        throw new ApolloError("Something went wrong", "Bad Input", { status: 403 });
      }
    }
    else if (args.ingredient != null && args.author != null) {
      const recetas_db = await context.client.collection("Recipes").find({ ingredients: args.ingredient, author: args.author }).toArray()
      if (recetas_db.length != 0) {
        return recetas_db.map(r => ({
          ...r,
          ingredients: r.ingredients.map(async function(i:any){
            return await context.client.collection("Ingredients").findOne({ name:i})
          }),
          id: r._id.toString()
        }))
      }
      else {
        throw new ApolloError("Something went wrong", "Bad Input", { status: 403 });
      }
    }
    else {
      const recetas = await context.client.collection("Recipes").find().toArray();
      return recetas.map(r => ({
        ...r,
        ingredients: r.ingredients.map(async function(i:any){
          return await context.client.collection("Ingredients").findOne({ name:i})
        }),
        id: r._id.toString()
      }))
    }
  }

export async function getRecipe(parent: any, args: { id: string }, context: { client: Db} ){
    const valid_id = new ObjectId(args.id);
    const recipe = await context.client.collection("Recipes").findOne({ _id: valid_id }) as unknown as Receta;
    if(recipe) {
      return {
        ...recipe,
        ingredients: recipe.ingredients.map(async function(i:any){
          return await context.client.collection("Ingredients").findOne({ name:i})
        }),
        id: args.id
      }
    }
    else{
      throw new ApolloError("Something went wrong", "Bad Input", { status: 403 });
    }
    
  }

export async function getUser(parent: any, args: {id:string},context :{client: Db}){

    const user_search= await context.client.collection("Users").findOne({_id:new ObjectId(args.id)})
    if(user_search){
    const recipes= await context.client.collection("Recipes").find({ author: args.id }).toArray();
    
    return{
      ...user_search,
      recipes: recipes.map(r => ({
        ...r,
        ingredients: r.ingredients.map(async function(i:any){
          return await context.client.collection("Ingredients").findOne({ name:i})
        })
      }))
    } as unknown as Usuario
}
}

export async function getUsers(parent: any, args: {id:string},context :{client: Db}){
  const user_search= await context.client.collection("Users").find().toArray();
  if(user_search.length > 0){   
  return user_search.map(async u=>({
      ...u,
      id: u._id.toString(),
      recipes:  (await context.client.collection("Recipes").find({author:u._id.toString()}).toArray()).map(async r => ({
        ...r,
        ingredients: r.ingredients.map(async function(i:any){
          return await context.client.collection("Ingredients").findOne({ name:i})
          
        })
      }))
    }))
    
  } 
}
export const User = {
  recipes: async (parent: { id: string }, args: any, context: { client: Db }) => {
    const recetas = await context.client.collection("Recipes").find({ author: parent.id }).toArray();
    return recetas;
  }
}

export const Recipe = {
  ingredients: async (parent: { id: string, ingredients: string[] }, args: any, context: { client: Db }) => {
    const ingredientes = await context.client.collection("Ingredients").find({ _id: { $in: parent.ingredients.map(i => new ObjectId(i)) } }).toArray();
    return ingredientes.map(r => ({
      ...r,
      id: r._id.toString()
    }))
  },
  author: async (parent: { author: string }, args: any, context: { client: Db }) => {
    const user = await context.client.collection("Users").findOne({ _id: new ObjectId(parent.author) }) as unknown as Usuario
    return {
      ...user,
      id: user._id
    };
  }
}

export const Ingredient = {
  recipes: async (parent: { id: string }, args: any, context: { client: Db }) => {
    const recetas = await context.client.collection("Recipes").find({ ingredients: parent.id }).toArray();
    return recetas.map(r => ({
      ...r,
      id: r._id.toString()
    }));
  }
}


module.exports = {
    getRecipes,
    getRecipe,
    getUser,
    getUsers
}
