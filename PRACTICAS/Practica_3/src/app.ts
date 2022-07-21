import { Db } from "mongodb";
import { connectDB } from "./mongo";
import express from "express";
import { book, free, freeSeats, signin, status, login,logout,myBookings } from "./resolvers";
let username:string="unknown"
import dotenv from "dotenv";


const run = async () => {
  const db: Db = await connectDB(); //Connect only once to de DB
  dotenv.config() // Config the env variables
  const app = express(); //Express router
  app.set("db", db); // Set db as env variable

  app.use((req, res, next) => {
    next();
  });
  const bodyParser = require('body-parser'); //Body parser to get data from request body
  app.use(bodyParser.json());
  app.use(bodyParser.text());
  app.use(bodyParser.urlencoded({ extended: true }))
  //Routes
  app.get("/status", status);
  app.get("/freeSeats", freeSeats);
  app.post("/book", book);
  app.post("/free", free);
  app.post("/signin", signin);
  app.post("/login", login);
  app.post("/logout", logout);
  app.get("/myBookings",myBookings)
  await app.listen(process.env.PORT);
  console.log(`Server running on port ${process.env.PORT}`);
};

try {
  run();
} catch (e) {
  console.error(e);
}
