import { ApolloError } from "apollo-server";
import { Collection } from "mongodb";


export const Query = {
    getChats: async (parent: any, args: {}, context: { chatsDb: Collection,token:string }) => {
        if(Auth(context.token,process.env.TOKEN as string)==false){
            throw new ApolloError('Not Logged In', 'MY_ERROR_CODE');
        }
        const active_Chats =await context.chatsDb.find({users:{$gt:0}}).toArray();
        return active_Chats.map(elem => ({
            name: elem.name,
            users:elem.users
        }))

    }



}

const Auth = (contra: string, token: string) => {
    if(contra === token) {
        return true;
    }else{
        return false;
    }
  }