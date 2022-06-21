import { ApolloError } from "apollo-server";
import * as dotenv from "dotenv";
import { pubSub } from '../pubSub';
dotenv.config();
export const Subscription = {
   subscribeMatch : {
         subscribe: (parent:any,args:{id:string},context:any) =>pubSub.asyncIterator([args.id]),
         resolve: async (payload:any) => {
               return payload;
         },
      }
}




