import {ObjectId } from "mongodb";

  export type User={
    _id?:string,
    email:string,
    pwd:string,
    token?:any,
    recipes?:[string]
  }
  export type Post ={
    email:string,
    comment:string
  }

