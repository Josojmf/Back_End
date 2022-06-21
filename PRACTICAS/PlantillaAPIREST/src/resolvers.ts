import { Request, Response } from "express";
import { Db } from "mongodb";
import { v4 as uuid } from "uuid";

const checkDateValidity = (
  day: string,
  month: string,
  year: string
): boolean => {
  const date = new Date(`${month} ${day}, ${year}`);
  return date.toString() !== "Invalid Date";
};

export const status = async (req: Request, res: Response) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  res.status(200).send(`${day}-${month}-${year}`);
};

export const signin = async (req: Request, res: Response) => {

  const db: Db = req.app.get("db");
  const collection = db.collection("Users");
  if (!req.body) {
    return res.status(500).send("No params");
  }

  const { username, password } = req.body as {
    username: string;
    password: string;
  }

  if (!username || !password) {
    console.log(req.body)
    return res.status(500).send(`No username or password `);
  }
  const user = await collection.findOne({ username });
  if (user) {
    return res.status(409).send("Username already in use")
  } else {
    await collection.insertOne({ username, password, token:null });
    return res.status(200).send("Signed in")
  }
}
export const login = async (req: Request, res: Response) => {

  const db: Db = req.app.get("db");
  const collection = db.collection("Users");
  if (!req.query) {
    return res.status(500).send("No params");
  }

  const { username, password } = req.body as {
    username: string;
    password: string;
  }

  if (!username || !password) {
    return res.status(500).send("No username or password");
  }
  const user = await collection.findOne({ username, password });
  if (user) {
      if(user.token!=null){
      res.status(500).send(`Already logged in, your token is ${user.token}`)
    } else {
      const token = uuid();
      await collection.updateOne({ username }, { $set: { token:token } });

      return res.status(200).send(`Logged in ${token}`);
    }
  } else {
    return res.status(401).send("Incorrect username or password");
  }
}

export const logout = async (req: Request, res: Response) => {

  const db: Db = req.app.get("db");
  const collection = db.collection("Users");
  if (!req.query) {
    return res.status(500).send("No params");
  }
  const active = await collection.findOne({ token:req.headers.token });
  if (active) {
    await collection.updateOne({token:req.headers.token},{$set:{ token:null} });
    return res.status(200).send(`Logged out ${active.username}`);
  } else {
    return res.status(401).send(`This user is not active or not found`);
  }
}

