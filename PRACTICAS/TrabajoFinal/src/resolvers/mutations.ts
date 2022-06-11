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
            throw new ApolloError('Email en Uso', 'EMAIL_USE');
        }
    },
    SignOut: async (parent: any, args: any, context: { usersDb: Collection, recipesDb: Collection,token_headers:string }) => {
                if(Auth(context.token_headers,process.env.TOKEN as string)==false){
                throw new ApolloError('Not Logged In', 'MY_ERROR_CODE');
            }
    await context.recipesDb.findOneAndDelete({uthor:process.env.TOKEN as string });
    const user= await context.usersDb.findOneAndDelete({id:process.env.TOKEN as string});
    return user.ok;
    },
    LogIn: async (parent: any, args: { email: string, pwd: string }, context: { usersDb: Collection }) => {
        const user = (await context.usersDb.findOne({ email: (args.email) }));
        if (user) {
            if (user.token !== null) {
                throw new ApolloError('Usuario ya loggeado', 'MY_ERROR_CODE');
            } else {
                if (brcypt.compareSync(args.pwd, user.password)) {
                    const tok = uuidv4();
                    process.env.TOKEN=tok;
                    (await context.usersDb.updateOne({ email: (args.email) }, { $set: { token: tok } }))
                    return tok;
                } else {
                    throw new ApolloError('USUARIO O CONTRASEÑA ERRONEO', 'CREDENTIALS_ERR');
                }
            }
        } else {
            throw new ApolloError('USUARIO O CONTRASEÑA ERRONEO', 'CREDENTIALS_ERR');
        }
    },
    LogOut: async (parent: any, args: any, context: { usersDb: Collection ,token:string}) => {

        if(Auth(context.token,process.env.TOKEN as string)==false){
            throw new ApolloError('Not Logged in', 'MY_ERROR_CODE');
        }
        (await context.usersDb.updateOne({ token: context.token }, {$set: {token: null}}))
        const user = (await context.usersDb.findOne({ token: context.token }));// as User);
        if (!user) {
            process.env.TOKEN="null";
            return "Logged Out"
        } else {
            throw new ApolloError('Invalid Token', 'INVALID_TOKEN');
        }
    },
    createPost:async(parent:any,args:{email:string,comment:string},context:{pubsub:PubSub,usersDb:Collection,token:string})=>{
        let postCreated={
            email:args.email,
            comment:args.comment
        };
        var doc= await context.usersDb.findOne({ token:context.token})
        if(doc!.chat==null){
            return "Not in a chat"
        }else{
        
        context.pubsub.publish(doc!.chat, {
            postCreated
          });
          return postCreated;
        }
          
          
    },
    quit:async(parent:any,args:any,context:{usersDb: Collection,token:string,activeChats:Map<string,number>,subscriptionServer:SubscriptionServer})=>{
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