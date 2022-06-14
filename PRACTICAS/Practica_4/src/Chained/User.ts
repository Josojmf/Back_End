import { Db } from "mongodb";

export const User = {
    recipes: async (parent: { id: string }, args: any, context: { client: Db }) => {
      const recetas = await context.client.collection("Recipes").find({ author: parent.id }).toArray();
      return recetas;
    }
  }
  
  
  module.exports =User