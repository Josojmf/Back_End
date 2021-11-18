import { Request, Response } from "express";
import { Db } from "mongodb";
import { v4 as uuid } from "uuid";
import bodyParser from "body-parser";
import { stringify } from "querystring";


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
    return res.status(500).send(`No username or password `);
  }
  const user = await collection.findOne({ username });
  if (user) {
    return res.status(409).send("Username already in use")
  } else {
    await collection.insertOne({ username, password });
    return res.status(200).send("Signed in")
  }
}
export const login = async (req: Request, res: Response) => {

  const db: Db = req.app.get("db");
  const collection = db.collection("Users");
  const collectionToken = db.collection("ActiveTokens");
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
    const token = uuid();
    const alreadyIn = await collectionToken.findOne({ username });
    if (alreadyIn) {
      res.status(500).send(`Already logged in, your token is ${token}`)
    } else {
      await collectionToken.insertOne({ token, username });
      return res.status(200).send(`Logged in ${token}`);
    }
  } else {
    return res.status(401).send("Incorrect username or password");
  }
}

export const logout = async (req: Request, res: Response) => {

  const db: Db = req.app.get("db");
  const collection = db.collection("Users");
  const collectionToken = db.collection("ActiveTokens");
  let username: string = "unknown"
  if (!req.query) {
    return res.status(500).send("No params");
  }
  const { token } = req.headers as {
    token: string;
  };
  const active = await collectionToken.findOne({ token });

  if (active) {
    Object.keys(active).forEach((k: string) => {
      if (k == "username") {
        username = `${(active)[k]}`
      }
    });
    await collectionToken.deleteOne({ token });
    return res.status(200).send(`Logged out ${username}`);
  } else {
    return res.status(401).send(`This user is not active or not found`);
  }
}

export const freeSeats = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("Seats");
  const collectionToken = db.collection("ActiveTokens");
  const { token } = req.headers as {
    token: string;
  };
  const { day, month, year } = req.query as {
    day: string;
    month: string;
    year: string;
  };
  if (!req.query) {
    return res.status(500).send("No params");
  }

  const loggedin = await collectionToken.findOne({ token })
  if (!token) {
    return res.status(500).send("No login token");
  }
  if (!day || !month || !year) {
    return res.status(500).send("Missing day, month or year");
  }

  if (!checkDateValidity(day, month, year)) {
    return res.status(500).send("Invalid day, month or year");
  }
  if (loggedin) {
    const seats = await collection.find({ day, month, year }).toArray();

    const freeSeats = [];
    for (let i = 1; i <= 20; i++) {
      if (!seats.find((seat) => parseInt(seat.number) === i)) {
        freeSeats.push(i);
      }
    }
    return res.status(200).json({ free: freeSeats });
  } else {
    return res.status(500).send("Not logged in");
  }
};

export const book = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("Seats");
  const collectionToken = db.collection("ActiveTokens");
  let username: string = "unknown"
  const { token } = req.headers as {
    token: string;
  };
  const { day, month, year, number } = req.query as {
    day: string;
    month: string;
    year: string;
    number: string;
  };
  if (!req.query) {
    return res.status(500).send("No params");
  }

  const loggedin = await collectionToken.findOne({ token })
  if (loggedin) {
    Object.keys(loggedin).forEach((k: string) => {
      if (k == "username") {
        username = `${(loggedin)[k]}`
      }
    });
  }
  if (!token) {
    return res.status(500).send("No login token");
  }
  if (!day || !month || !year || !number) {
    return res.status(500).send("Missing day, month or year or seat number");
  }

  if (!checkDateValidity(day, month, year)) {
    return res.status(500).send("Invalid day, month or year");
  }
  if (loggedin) {
    const notFree = await collection.findOne({ day, month, year, number });
    if (notFree) {
      return res.status(500).send("Seat is not free");
    }

    const tokenRet = uuid();
    await collection.insertOne({ day, month, year, number, tokenRet, username });

    return res.status(200).json({ number,tokenRet });
  } else {
    return res.status(500).send(`Not  Logged in ${loggedin} ${token}`)
  }
};

export const free = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("Seats");
  const collectionToken = db.collection("ActiveTokens");
  let loggedusername: string = "unknown"
  let bookusername: string = "unknown"
  if (!req.query) {
    return res.status(500).send("No params");
  }
  const { token } = req.headers as {
    token: string;
  };
  const { day, month, year, tokenRet } = req.body as {
    day: string;
    month: string;
    year: string;
    tokenRet: string;
  };
  const loggedin = await collectionToken.findOne({ token })
  if (!token) {
    return res.status(500).send("No login token");
  }



  if (!day || !month || !year || !tokenRet) {
    return res
      .status(500)
      .send("Missing day, month or year or seat number or token");
  }

  if (!checkDateValidity(day, month, year)) {
    return res.status(500).send("Invalid day, month or year");
  }
  if (loggedin) {
    Object.keys(loggedin).forEach((k: string) => {
      if (k == "username") {
        loggedusername = `${(loggedin)[k]}`
      }
    });
    const booked = await collection.findOne({ day, month, year, tokenRet });
    if (booked) {
      Object.keys(booked).forEach((k: string) => {
        if (k == "username") {
          bookusername = `${(booked)[k]}`
        }
      });
      if (loggedusername == bookusername) {
        await collection.deleteOne({ day, month, year, tokenRet });
        return res.status(200).send("Seat is now free");
      } else {
        return res.status(500).send("It's not your seat");

      }
    }

    return res.status(500).send("Seat is not booked");
  }
};

export const myBookings = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("Seats");
  const collectionToken = db.collection("ActiveTokens");
  let username: string = "unknown"
  let number: string = "null"
  const { token } = req.headers as {
    token: string;
  };
  if (!req.headers) {
    return res.status(500).send("No params");
  }

  const loggedin = await collectionToken.findOne({ token })
  if (!token) {
    return res.status(500).send("No login token");
  }

  if (loggedin) {
    Object.keys(loggedin).forEach((k: string) => {
      if (k == "username") {
        username = `${(loggedin)[k]}`
      }
    });
    const seats = await collection.find({ username }).toArray();
    return res.status(200).json({ myseats: seats });
  } else {
    return res.status(500).send("Not logged in");
  }
};

