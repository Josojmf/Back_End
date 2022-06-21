import { Db } from "mongodb";
import { getAndSaveRickyMortyCharacters } from "./populatedb";
import express from "express";
import { character, characters, login, register, signout } from "./resolvers";

const run = async () => {
  const db: Db = await getAndSaveRickyMortyCharacters();
  const app = express();
  app.set("db", db);
  app.use(async(req, res, next) => {
    if(req.originalUrl === "/characters" || req.originalUrl === `/character?` || req.originalUrl === "/signout" || req.originalUrl === "/delete"){
      console.log(req.headers['uiid']);
      const user = await db.collection("R_users").findOne({uiid:req.headers.uiid});
      if(user){
        next();
      }
      else{
        res.status(401).json({
          Status: 401,
          Error:"User not created"
        })
      }
    }
    else if (req.originalUrl === `/login?username=${req.query.username}&password=${req.query.password}`){
      next();
    }
    else if (req.originalUrl === `/register?username=${req.query.username}&password=${req.query.password}`){
      next();
    }
    else
      res.status(404).json({
        Status:404,
        Error: "You are not log in"
      });
    // else{
    //   res.status(401).json({
    //     Status:401,
    //     Error: "Invalid token"
    //   })
    // }
  });


  app.get("/status", async (req, res) => {
    res.status(200).send("Todo OK");
  });
  app.post("/register",register)
  app.get("/login",login)
  app.get("/characters", characters);
  app.get("/character/:id", character);
  app.get("/signOut",signout)
  await app.listen(4000);
  //app.get("/character/:id", character);

  
};

try {
  run();
} catch (e) {
  console.error(e);
}
