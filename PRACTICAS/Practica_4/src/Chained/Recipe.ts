import { Db, ObjectId } from "mongodb";
import { Usuario } from "../types";

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
  module.exports = Recipe