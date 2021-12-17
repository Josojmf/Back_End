import { Collection, Db, MongoClient } from "mongodb";
import { idText } from "typescript";
import { v4 as uuid } from "uuid";
import{Schema} from "./schema"
const dotenv = require('dotenv');
dotenv.config();
const client = new MongoClient(`mongodb+srv://${process.env.DB_USR}:${process.env.DB_PWD}@cluster0.6xzff.mongodb.net/RecipesBlog?retryWrites=true&w=majority`)
client.connect();
const db: Db = client.db("RecipesBlog")
const collection: Collection = db.collection("Users")
const collectionActive: Collection = db.collection("ActiveUsers")
const collectionIngredients: Collection = db.collection("Ingredients")
const collectionRecipes: Collection = db.collection("Recipes")


export async function getRecipes(parent: any, args: any,context:any) {
    if(args.author!=null){
        return collectionRecipes.find({"user":args.author}).toArray();

    }else if(args.ingredient!=null){
        return collectionRecipes.find({"ingredient":{"0":{"name":args.ingredient}}}).toArray();
    }else
        return collectionRecipes.find().toArray();

}

export async function getRecipe(parent: any, args: any){
    return collectionRecipes.findOne({"id":args.id})
}

export async function getUser(parent: any, args: any){

    return collection.findOne({"id":args.id})
}








module.exports = {
    getRecipes,
    getRecipe,
    getUser
}
