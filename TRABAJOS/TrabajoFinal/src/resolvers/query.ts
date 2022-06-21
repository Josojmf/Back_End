
import {  Db } from "mongodb";

export const Query = {
    getChats:async (parent: any, args:any , context: { client: Db })=>{
          const chats = await context.client.collection("Chats").find({}).toArray()
          if(chats){ 

          return chats.map(ch =>({ 
            name:ch.name,
            users:ch.users.map(async function(us:any){
              return await context.client.collection("Users").findOne({email:us})
            }),
          }) )
  }}
         
}
