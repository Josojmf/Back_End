import { ApolloError } from 'apollo-server-errors';
import { Db } from "mongodb";
import { v4 as uuidv4 } from "uuid";
const brcypt = require("bcrypt");
import * as dotenv from "dotenv";

dotenv.config();

export const Mutation = {

    SignIn: async (parent: any, args: { email: string, pwd: string }, context: { client: Db }) => {
        const user = await context.client.collection("Users").findOne({ email: args.email });
        if (!user) {
            const usuario = {
                email: args.email,
                password: brcypt.hashSync(args.pwd, 10),
                token: null,
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
                    return `This is your session token : ${tok}`;
                } else {
                    throw new ApolloError('USUARIO O CONTRASEÑA ERRONEO', 'AUTH_ERR', { status: 403 });
                }
            }
        } else {
            throw new ApolloError('USUARIO O CONTRASEÑA ERRONEO', 'AUTH_ERR', { status: 403 });
        }
    },
    
    LogOut: async (parent: any, args: any, context: { client: Db, token: string }) => {
        await context.client.collection("Users").updateOne({ token: context.token }, { $set: { token: null } })
        return "Logged Out"
    },
   
}
