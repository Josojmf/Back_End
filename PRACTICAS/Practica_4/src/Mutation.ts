import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { ApolloError } from 'apollo-server'
import { idText } from "typescript";
import { v4 as uuid } from "uuid";
import { Receta, Usuario } from "./types";
//Mutations
export async function signin(parent: any, args: any, context: { client: Db }) {

    if (await context.client.collection("Users").findOne({"mail":args.email})) {
        return "User already taken"
    } else {

        context.client.collection("Users").insertOne({"mail":args.email, "password":args.password,"recipes":[]})
        return "Signed in"
    }
}

export async function SignOut(parent: any, args: any, context: { client: Db }) {
    if (await context.client.collection("Users").findOne({"mail":args.email}))
        return "User does not exist"
    else {
        context.client.collection("Users").deleteOne({"mail":args.email, "password":args.password})
        return "deleted"
    }
}

export async function login(parent: any, args: any,context:{client: Db}) {
    const user= await context.client.collection("Users").findOne({"mail":args.email,"password": args.password})
    const Activeuser= await context.client.collection("ActiveUsers").findOne({"mail":args.email})
    if (Activeuser) {
        throw new ApolloError("User already logged in", "Bad Input", { status: 403 });
    }
    else{
    if (user) {
        const token = uuid();
        const id_us= user._id;
        context.client.collection("ActiveUsers").insertOne({"mail":args.email, "token":token, _id:new ObjectId(id_us)})
        return `Welcome ${args.email} your session token is : ${token}`
    } else {
        return "Wrong username or password"
    }
}
}
export async function LogOut(parent: any, args: any,context:{client: Db}) {
        context.client.collection("ActiveUsers").deleteOne({"mail":args.email})
        return "Logged Out"
}
export async function addIngredient(parent: any, args: { name: string }, context: { client: Db }) {
    const name =args.name as string;
        const ingredientRepeat = await context.client.collection("Ingredients").findOne({ name })
        if(ingredientRepeat){
            throw new ApolloError("Ingredient already exists","405");
        }
        const ingrediente = {...args}
            await context.client.collection("Ingredients").insertOne(ingrediente)
            return  ingrediente;

}
export async function  deleteIngredient(parent: any, args: {id: string}, context: { client: Db}) {
    await context.client.collection("Ingredients").deleteOne({_id:new ObjectId(args.id)});
    await context.client.collection("Recipes").deleteMany({ingredients: args.id});
    return "Ingrediente Borrado";

}
export async function addRecipe(parent: any, args: { name: string, description: string, ingredients: string[] }, context: { client: Db, user: Usuario }) {
    const recipeRep= await context.client.collection("Recipes").findOne({name : args.name})
    if(recipeRep){
        throw new ApolloError("Recipe already exists","405");
    }
    else{
        const recipe = {
            ...args,
            author: context.user._id.toString()
        };
        context.client.collection("Recipes").insertOne(recipe);
        console.log(context.user._id)
        context.client.collection("Users").findOneAndUpdate({_id:new ObjectId(context.user._id)},{$set:{recipes:recipe}})
            return recipe;
    }

}
export async function updateRecipe(parent: any, args: { id: string, ingredients: string[] }, context: { client: Db, user: Usuario }) {
    const receta_db = await context.client.collection("Recipes").findOne({ author: context.user._id.toString(), _id: new ObjectId(args.id) });
    if (receta_db) {
        const ingredientes = await context.client.collection("Ingredients").find({ _id: { $in: args.ingredients.map((i: any) => new ObjectId(i)) } }).toArray();
        if (ingredientes) {
            await context.client.collection("Recipes").updateOne({ _id: receta_db._id }, { $push: { ingredients: { $each: args.ingredients } } });
            return "Receta actualizada";
        }
        else {
            throw new ApolloError("No existen esos ingredientes", " 405 ");
        }
    }
    else {
        throw new ApolloError("O no es tu receta o no existe "," 405" );
    }

}

export async function deleteRecipe(parent: any, args: { id: string }, context: { client: Db, user: Usuario }) {
    await context.client.collection("Recetas").deleteOne({ author: context.user['_id'].toString(), _id: new ObjectId(args.id) })
    return "Receta Borrada";
}

module.exports = {
    signin,
    login,
    SignOut,
    LogOut,
    addIngredient,
    deleteIngredient,
    addRecipe,
    deleteRecipe,
    updateRecipe,
}
