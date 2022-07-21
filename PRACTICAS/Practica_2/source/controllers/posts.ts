import { Request, Response, NextFunction } from 'express';
import { connectDB } from '../connectDB';
//Returns status of the server 
 const getStatus=async(req:Request,res:Response,next:NextFunction)=>{
     let a:String;
     a="OK-Programacion-I"
     if (res.statusCode === 200) { //If response equals 200 everithing is Ok so return good message
     return res.json({
        Status: res.statusCode,
         message:a
     })
 }else{
    return res.json({ //If response is not 200 return error message
        Status: res.statusCode,
            message:"Error 404"
    })
 }
}

// getting all posts
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const client = await connectDB(); // Connect to mongoDb
    let Characters = await client.collection("Characters").find().toArray() //Get all characters in DB to array form
    return res.status(200).json(
        {
           ...Characters //Return all characters but spreading them
            
        });
};

// getting a single post
const getPost = async (req: Request, res: Response, next: NextFunction) => {
    const client = await connectDB();// Connect to mongoDb
    let post = await client.collection("Characters").findOne({id:parseInt((req.params.id).substring(1))}) //Get character with the id that has been requested through the url params
    return res.status(200).json({
        Character:post //Return the character with Character key
      
    });
};

// deleting a post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    let id: number = parseInt(req.params.id.substring(1)); //Parsing the id from the url params
    const client=await connectDB()// Connect to mongoDb
    client.collection("Characters").deleteOne({id:id}) //Delete the character with the id that has been requested through the url params
    return res.status(200).json({
        message: 'post deleted successfully' //Returning confirmation message
    });
};
//Alternating status of one character
const switchStatus = async (req: Request, res: Response, next: NextFunction) => {
    let id: number = parseInt(req.params.id.substring(1)); //Parsing the id from the url params
    const client=await connectDB() // Connect to mongoDb
    const post= await client.collection("Characters").findOne({id: id}) //Get character with the id that has been requested through the url params
    let newStatus:string="unknown"; //Setting the new status to unknown to init the variable
    if(post){ // Check if the character exists
    if(post.status=="Alive") newStatus="Dead"; else newStatus="Alive" //Switching the temporary status variable depending on the original one
    client.collection("Characters").updateOne({id:id},{$set:{status:newStatus}}) //Updating the DB with the new status
    }
    return res.status(200).json({
        message: `switched to ${newStatus}` // Confirmation message
    });
}
// adding a post
const addPost = async (req: Request, res: Response, next: NextFunction) => {
    const client=await connectDB()// Connect to mongoDb
    let { id,name,status,species,episodes } = req.body as {  // get the data from req.body
        id: any;
        name: string;
        status:string;
        species:string;
        episodes:Array<object>;
      }
      id=parseInt(id) //Parse the recieved data
      client.collection("Characters").insertOne({id:id,name:name,status:status,species:species,episodes:episodes}) //Inserting the formatted data into DB
    return res.status(200).json({
        message: { //Returning what has been added
            id,
            name,
            status,
            species,
            episodes
        }
    });
};

export default { getPosts, getPost,deletePost,addPost,switchStatus,getStatus} //Exports for server.ts
