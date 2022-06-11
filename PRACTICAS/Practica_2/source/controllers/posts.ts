import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
//import {MongoClient} from "mongodb";
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://joso:123456abc@cluster0.6xzff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


let aux :any;
let aux1 :any;
let dbAll:any;
let status1:string;
interface Post {
    userId: Number;
    id: Number;
    title: String;
    body: String;
}
MongoClient.connect(url, function(err:any, db:any) {
    if (err) throw err;
    var dbo = db.db("MyDbBackend");
    dbAll=db;
    dbo.collection("Characters").find({}).toArray(function(err:any, result:any) {
      if (err) throw err;
      aux=result;
      db.close();
    });
  }); 
 const getStatus=async(req:Request,res:Response,next:NextFunction)=>{
     let a:String;
     a="OK-Programacion-I"
     return res.status(200).json({
         message:a
     })
 }

// getting all posts
const getPosts = async (req: Request, res: Response, next: NextFunction) => {

    let posts: [Post] = aux;
    return res.status(200).json({
         posts
    });
};

// getting a single post
const getPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    let id1:number= parseInt(req.params.id);
    MongoClient.connect(`mongodb+srv://joso:123456abc@cluster0.6xzff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority$`, function(err:any, db1:any) {
    var dbo = db1.db("MyDbBackend");
    dbo.collection("Characters").find({id:id1}).toArray(function(err:any, result:any) {
      db1.close();
      aux1=result;

    });
  }); 

    let post: [Post]=aux1;
    return res.status(200).json({
        post
      
    });
};

// deleting a post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from req.params
    let id: number = parseInt(req.params.id); -
    // delete the post
    MongoClient.connect(`mongodb+srv://joso:123456abc@cluster0.6xzff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority$`, function(err:any, db1:any) {
        var dbo = db1.db("MyDbBackend");
        //console.log(dbo.collection("Characters").find({id:id}).toArray(function(err:any, result:any) {}));
        dbo.collection("Characters").deleteOne({id:id})
       // db1.close();
      }); 
    // return response
    return res.status(200).json({
        message: 'post deleted successfully'
    });
};
const switchStatus = async (req: Request, res: Response, next: NextFunction) => {
    let id1:number= parseInt(req.params.id);
    let sw:any;
     MongoClient.connect(`mongodb+srv://joso:123456abc@cluster0.6xzff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority$`, function(err:any, db1:any) {
    var dbo = db1.db("MyDbBackend");
    dbo.collection("Characters").updateOne({id:id1,status:"Dead"},[{$set:{status:"Alive"}}])
 
    })
    
    MongoClient.connect(`mongodb+srv://joso:123456abc@cluster0.6xzff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority$`, function(err:any, db1:any) {
        var dbo = db1.db("MyDbBackend");
             dbo.collection("Characters").updateOne({id:id1,status:"Alive"},
            [{$set:{status:"Dead"}}]) 
        })

     
    
    return res.status(200).json({
        message: "switched"
    });
}

// adding a post
const addPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the data from req.body
    let title: string = req.body.title;
    let body: string = req.body.body;
    // add the post
    MongoClient.connect(`mongodb+srv://joso:123456abc@cluster0.6xzff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority$`, function(err:any, db1:any) {
        var dbo = db1.db("MyDbBackend");
        dbo.collection("Characters").insertOne({title,body}).toArray(function(err:any, result:any) {
          db1.close();
    
        });
      }); 
    // return response
    return res.status(200).json({
        message: title+body
    });
};

export default { getPosts, getPost,deletePost,addPost,switchStatus,getStatus}
