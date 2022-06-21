
import { ApolloError } from "apollo-server";
import { Db, ObjectId } from "mongodb";

export const Query = {
  listMatches: async (parent: any, args: any, context: { client: Db }) => {
    return await context.client.collection("Matches").find().toArray();
  },
  getMatch: async (parent: any, args:{id: string}, context: { client: Db }) => {
    const valid_id = new ObjectId(args.id);
    const match = await  context.client.collection("Matches").findOne({_id:valid_id});
    if(match){
      return{ ...match}
    }else{
      throw new ApolloError('Match not Found', 'Match not found', {status:404})
    }
   
  },

}
