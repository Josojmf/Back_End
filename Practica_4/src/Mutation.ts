import { Collection, Db, MongoClient } from "mongodb";
import { idText } from "typescript";
import { v4 as uuid } from "uuid";
const short = require('short-uuid');
const dotenv = require('dotenv');
dotenv.config();
const client = new MongoClient(`mongodb+srv://${process.env.DB_USR}:${process.env.DB_PWD}@cluster0.6xzff.mongodb.net/RecipesBlog?retryWrites=true&w=majority`)
client.connect();
const db: Db = client.db("RecipesBlog")
const collection: Collection = db.collection("Users")
const collectionActive: Collection = db.collection("ActiveUsers")
const collectionIngredients: Collection = db.collection("Ingredients")
const collectionRecipes: Collection = db.collection("Recipes")

//Mutations
export async function signin(parent: any, args: any) {

    if (await collection.findOne({"mail":args.email})) {
        return "User already taken"
    } else {
        let id=short.generate() as string;
        id=id.substring(0,6);
        collection.insertOne({"mail":args.email, "password":args.password,"id":id})
        return "Signed in"
    }
}

export async function signout(parent: any, args: any) {
    if (await collection.findOne({"mail":args.email}))
        return "User does not exist"
    else {
        collection.deleteOne({"mail":args.email, "password":args.password})
        return "deleted"
    }
}

export async function login(parent: any, args: any,context:{client: MongoClient,user:any}) {
    const user = {
        username: `${args.username}`,
        password: args.password,
    }
    if (await collection.findOne({"mail":args.email,"password": args.password})) {
        const token = uuid();
        collectionActive.insertOne({"mail":args.email, "token":token})
        return `Welcome ${args.email} your session token is : ${token}`

    } else {
        return "Wrong username or password"
    }
}
export async function logout(parent: any, args: any) {
    const user = {
        username: `${args.username}`,
        password: args.password,
    }
    if (await collection.findOne({"mail":args.email,"password": args.password})) {
        const token = uuid();
        collectionActive.deleteOne({"mail":args.email})
        return "Logged Out"

    } else {
        const token = "Wrong username or password"
        return token
    }
}
export async function addIngredient(parent: any, args: any) {
    const token = args.token
    const user=args.email
    const name =args.name as string;
    const active = await collectionActive.findOne({ token })
    if (active) {
        const ingredientRepeat = await collectionIngredients.findOne({ name })
        const recipesRet=(await collectionRecipes.find({"ingredients":name}).toArray()) 
        console.log(recipesRet)
     if (ingredientRepeat)
              return {
                id : 1,
                name : `${args.name}`,
                recipes :recipesRet
            }
        else {
            await collectionIngredients.insertOne({name,user})
            return {
                id : 1,
                name : `${args.name}`,
                recipes : recipesRet 
            }
        }

    } else {
        return "Not logged in"
    }
}
export async function deleteIngredient(parent: any, args: any) {
    const token = args.token
    const user=args.email
    const ingredient =args.name as string;
    const active = await collectionActive.findOne({ token })
    if (active) {
        const ingredientRepeat = await collectionIngredients.findOne({ "name":ingredient,"user":user })
        if (ingredientRepeat){
        await collectionIngredients.deleteOne({"name":ingredient}) 
        await collectionRecipes.deleteMany({"ingredient":{$elemMatch:{ingredient}}})  
        return "Deleted" 
        }
        else {
            return "Not your ingredient or it does not exist"
        }

    } else {
        return "Not logged in"
    }
}
export async function addRecipe(parent: any, args: any) {
    const token = args.token
    const user=args.email
    const recipe =args.recipe;
    const ingredients = args.ingredients
    const active = await collectionActive.findOne({ token })
    if (active) {
        const ingredientRepeat = await collectionIngredients.findOne({recipe})
        if (ingredientRepeat)
        return {
            recipe : `${args.recipe}`,
            ingredients : args.ingredients,
            author:args.email
        
        }
        else {
            await collectionRecipes.insertOne({recipe,ingredients,user})
            return {
                recipe : `${args.recipe}`,
                ingredients : args.ingredients,
                author:args.email
            
            }
        }

    } else {
        return "Not logged in"
    }
}

module.exports = {
    signin,
    login,
    signout,
    logout,
    addIngredient,
    deleteIngredient,
    addRecipe,
}
