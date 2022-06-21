
import { MongoClient } from "mongodb";
const brcypt = require("bcrypt");
import * as dotenv from "dotenv";
import { pubSub } from '../pubSub';



dotenv.config();
const mongouri: string = "mongodb+srv://joso:123456j@cluster0.6xzff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const clientM = new MongoClient(mongouri);
const client =clientM.db("Chat");
export const Subscription = {
    Join: {
        subscribe: async (parent:any,args:{sala:string},context:any) => pubSub.asyncIterator([args.sala]),
             resolve: async (payload:any) => {
                   return payload.postCreated;
             },
    }
}




