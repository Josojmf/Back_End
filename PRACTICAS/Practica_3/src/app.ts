import { Db } from "mongodb";
import { connectDB } from "./mongo";
import express from "express";
import { book, free, freeSeats, signin, status, login,logout,myBookings } from "./resolvers";
let username:string="unknown"
import dotenv from "dotenv";


const run = async () => {
  const db: Db = await connectDB();
  dotenv.config()
  const app = express();
  app.set("db", db);

  app.use((req, res, next) => {
    next();
  });
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.text());
  app.use(bodyParser.urlencoded({ extended: true }))
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
