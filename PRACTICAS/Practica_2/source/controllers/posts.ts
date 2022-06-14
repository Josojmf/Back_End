import { Request, Response, NextFunction } from 'express';
import { connectDB } from '../connectDB';
var MongoClient = require('mongodb').MongoClient;
 const getStatus=async(req:Request,res:Response,next:NextFunction)=>{
     let a:String;
     a="OK-Programacion-I"
     if (res.statusCode === 200) {
     return res.json({
        Status: res.statusCode,
         message:a
     })
 }else{
    return res.json({
        Status: res.statusCode,
            message:"Error 404"
    })
 }
}

// getting all posts
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const client = await connectDB();
    let Characters = await client.collection("Characters").find().toArray()
    return res.status(200).json(
        {
           ...Characters
            
        });
};

// getting a single post
const getPost = async (req: Request, res: Response, next: NextFunction) => {
    const client = await connectDB();
    let post = await client.collection("Characters").find({id:parseInt((req.params.id).substring(1))}).toArray()
    return res.status(200).json({
        Character:post
      
    });
};

// deleting a post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    let id: number = parseInt(req.params.id.substring(1)); 
    const client=await connectDB()
    client.collection("Characters").deleteOne({id:id})
    return res.status(200).json({
        message: 'post deleted successfully'
    });
};
const switchStatus = async (req: Request, res: Response, next: NextFunction) => {
    let id: number = parseInt(req.params.id.substring(1)); 
    const client=await connectDB()
    const post= await client.collection("Characters").findOne({id: id})
    let newStatus:string="unknown";
    if(post){
    console.log(post.status=="Dead")
    if(post.status=="Alive") newStatus="Dead"; else newStatus="Alive"
    client.collection("Characters").updateOne({id:id},{$set:{status:newStatus}})
    }
    return res.status(200).json({
        message: `switched to ${newStatus}`
    });
}
// adding a post
const addPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the data from req.body
    const client=await connectDB()
    let { id,name,status,species,episodes } = req.body as {
        id: any;
        name: string;
        status:string;
        species:string;
        episodes:Array<object>;
      }
      id=parseInt(id)
      client.collection("Characters").insertOne({id:id,name:name,status:status,species:species,episodes:episodes})
    return res.status(200).json({
        message: {
            id,
            name,
            status,
            species,
            episodes
        }
    });
};

export default { getPosts, getPost,deletePost,addPost,switchStatus,getStatus}
