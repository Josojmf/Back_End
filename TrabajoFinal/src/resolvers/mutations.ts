import { ApolloError } from 'apollo-server-errors';
import { Collection, Db, ObjectId } from "mongodb";
import { User } from "../types";
import { v4 as uuidv4 } from "uuid";
const brcypt = require("bcrypt");
import * as dotenv from "dotenv";
import { PubSub } from 'graphql-subscriptions';
import { subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';


dotenv.config();

export const Mutation = {
    SignIn: async (parent: any, args: { email: string, pwd: string }, context: { usersDb: Collection }) => {
        const user = await context.usersDb.findOne({ email: args.email });
        if (!user) {
            const tok = uuidv4();
            const usuario = {
                email: args.email,
                password: brcypt.hashSync(args.pwd, 10),
                token: null,
                chat:null
            };
            await context.usersDb.insertOne(usuario);
            const user2 = await context.usersDb.findOne({ email: args.email });
            if (user2) {
                return {
                    id: user2._id,
                    email: user2.email as string,
                    pwd: user2.password as string,
                    token: tok,
                }
            }
        } else {
            throw new ApolloError('Usuario ya registrado', 'MY_ERROR_CODE');
        }
    },
    SignOut: async (parent: any, args: any, context: { usersDb: Collection, recipesDb: Collection,token_headers:string }) => {
                if(Auth(context.token_headers,process.env.TOKEN as string)==false){
                throw new ApolloError('Para esta petición, registrate primero', 'MY_ERROR_CODE');
            }
    await context.recipesDb.findOneAndDelete({uthor:process.env.TOKEN as string });
    const user= await context.usersDb.findOneAndDelete({id:process.env.TOKEN as string});
    return user.ok;
    },
    LogIn: async (parent: any, args: { email: string, pwd: string }, context: { usersDb: Collection }) => {
        const user = (await context.usersDb.findOne({ email: (args.email) }));// as User);
        if (user) {
            if (user.token !== null) {
                throw new ApolloError('Usuario ya loggeado', 'MY_ERROR_CODE');
            } else {
                if (brcypt.compareSync(args.pwd, user.password)) {
                    const tok = uuidv4();
                    process.env.PORT=tok;
                    (await context.usersDb.updateOne({ email: (args.email) }, { $set: { token: tok } }))
                    return true;
                } else {
                    throw new ApolloError('Las contraseñas no coinciden', 'MY_ERROR_CODE');
                }
            }
        } else {
            throw new ApolloError('Usuario no registrado', 'MY_ERROR_CODE');
        }
    },
    LogOut: async (parent: any, args: { token: string }, context: { usersDb: Collection ,token_headers:string}) => {

        if(Auth(context.token_headers,process.env.TOKEN as string)==false){
            throw new ApolloError('Para esta petición, registrate primero', 'MY_ERROR_CODE');
        }
        (await context.usersDb.updateOne({ token: args.token }, {
            set: {
                token: null
            }
        }))

        const user = (await context.usersDb.findOne({ token: args.token }));// as User);
        if (!user) {
            process.env.PORT="";
            return "El token se ha borrado"
        } else {
            throw new ApolloError('Token no registrado', 'MY_ERROR_CODE');
        }
    },
    createPost:async(parent:any,args:{email:string,comment:string},context:{pubsub:PubSub})=>{
        let postCreated={
            email:args.email,
            comment:args.comment
        };
        context.pubsub.publish('Chat1', {
            postCreated
          });
          
          return postCreated;
          
    },
    quit:async(parent:any,args:any,context:{usersDb: Collection,token:string,activeChats:Map<string,number>})=>{
        if(Auth(context.token,process.env.TOKEN as string)==false){
            throw new ApolloError('Not Logged In', 'MY_ERROR_CODE');
        }
        var doc= await context.usersDb.findOne({token:context.token})
        if(doc!.chat==null){
            return "Not in a chat"
        }else{
        let nUsers=context.activeChats.get(doc!.chat)
        context.activeChats.set(doc!.chat,nUsers!-1)
        if(nUsers!==0){
            context.activeChats.delete(doc!.chat)
        }
        context.usersDb.updateOne({token:context.token},{$set:{chat:null}})
        
        return "Out of the chat"
    }
    }
    
}
const desencriptar = (contraseña: string, hash: string) => {
    return brcypt.compareSync(contraseña, hash);//compara la contraseña con el hash
}

const Auth = (contra: string, token: string) => {
    if(contra === token) {
        return true;
    }else{
        return false;
    }
  }