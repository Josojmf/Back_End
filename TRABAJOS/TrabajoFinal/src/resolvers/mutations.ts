import { ApolloError } from 'apollo-server-errors';
import { Db } from "mongodb";
import { v4 as uuidv4 } from "uuid";
const brcypt = require("bcrypt");
import * as dotenv from "dotenv";
import { pubSub } from '../pubSub';

dotenv.config();

export const Mutation = {
    SignIn: async (parent: any, args: { email: string, pwd: string }, context: { client: Db }) => {
        const user = await context.client.collection("Users").findOne({ email: args.email });
        if (!user) {
            const usuario = {
                email: args.email,
                password: brcypt.hashSync(args.pwd, 10),
                token: null,
                chat: null
            };
            await context.client.collection("Users").insertOne(usuario);
            return "Signed in!"
        } else {
            throw new ApolloError('Email en Uso', 'EMAIL_USE');
        }
    },
    SignOut: async (parent: any, args: any, context: { client: Db, token: string }) => {
        await context.client.collection("Users").deleteOne({ token: context.token });
        return "Signed out";
    },
    LogIn: async (parent: any, args: { email: string, pwd: string }, context: { client: Db }) => {
        const user = await context.client.collection("Users").findOne({ email: args.email })
        if (user) {
            if (user.token !== null) {
                throw new ApolloError('Usuario ya loggeado', 'MY_ERROR_CODE');
            } else {
                if (brcypt.compareSync(args.pwd, user.password)) {
                    const tok = uuidv4();
                    (await context.client.collection("Users").updateOne({ email: (args.email) }, { $set: { token: tok } }))
                    return tok;
                } else {
                    throw new ApolloError('USUARIO O CONTRASEÑA ERRONEO', 'CREDENTIALS_ERR');
                }
            }
        } else {
            throw new ApolloError('USUARIO O CONTRASEÑA ERRONEO', 'CREDENTIALS_ERR');
        }
    },
    LogOut: async (parent: any, args: any, context: { client: Db, token: string }) => {
        await context.client.collection("Users").updateOne({ token: context.token }, { $set: { token: null } })
        return "Logged Out"
    },
    SendMessage: async (parent: any, args: { email: string, comment: string }, context: { client: Db, token: string }) => {

        var doc = await context.client.collection("Users").findOne({ token: context.token })
        if (doc!.chat == null) {
            return "Not in a chat"
        } else {
            pubSub.publish(doc!.chat.toString(), {
                postCreated: {
                    email: args.email,
                    comment: args.comment

                }
            });
            return "Post Created";
        }
    },
    Quit: async (parent: any, args: any, context: { client: Db, token: string }) => {
        const user = await context.client.collection("Users").findOne({ token: context.token })

        if (user) {
            const chatUs = user.chat
            await context.client.collection("Chats").updateOne({ name: user.chat }, { $pull: { users: user.email } })
            await context.client.collection("Users").updateOne({ email: user.email }, { $set: { chat: null } })
            var chat = await context.client.collection("Chats").findOne({ name: user.chat })
            if (chat!.users.length == 0) {
                await context.client.collection("Chats").deleteOne({ name: user.chat })
                return "Deleted Chat"
            }
        }



    }

}
