
import { Db } from "mongodb";

export const Query = {
  getUsers: async (parent: any, args: any, context: { client: Db }) => {
    return await context.client.collection("Users").find().toArray();
  }
}
