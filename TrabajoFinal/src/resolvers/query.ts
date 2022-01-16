import { ApolloError } from "apollo-server";
import { Collection } from "mongodb";


export const Query = {
    getChats:(parent:any,args:any,context:{token:string,activeChats:Map<string,number>})=>{
        if(Auth(context.token,process.env.TOKEN as string)==false){
          throw new ApolloError('Not Logged IN', 'MY_ERROR_CODE');
      }
        if(context.activeChats.size==0){
          throw new ApolloError("No hay Chats Activos","EMPTY_CHATS");
        }else
        console.log(context.activeChats.keys())
        return context.activeChats.values();

    }



}

const Auth = (contra: string, token: string) => {
    if(contra === token) {
        return true;
    }else{
        return false;
    }
  }