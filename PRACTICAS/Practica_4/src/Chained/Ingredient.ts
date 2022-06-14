import { Db } from "mongodb";

export const Ingredient = {
    recipes: async (parent: { id: string }, args: any, context: { client: Db }) => {
      const recetas = await context.client.collection("Recipes").find({ ingredients: parent.id }).toArray();
      return recetas.map(r => ({
        ...r,
        id: r._id.toString()
      }));
    }
  }

module.exports =Ingredient