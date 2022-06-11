import { Request, Response } from "express";
import { Db } from "mongodb";
import { v4 as uuid } from "uuid";
import bodyParser from "body-parser";
import { stringify } from "querystring";
import { type } from "os";


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
  let username: string = "unknown"
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

export const freeSeats = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("Users");
  const collectionSeats = db.collection("Seats");
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
  const loggedin = await collection.findOne({ token:req.headers.token });
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
    let freeSeats : string[]=[];
    for (let i = 1; i <= 20; i++) {
      freeSeats.push(i.toString());
    }
    const seats = await collectionSeats.find({ day, month, year }).toArray();
    const busy_seats=seats.map(function(s){
      return(s.number)
    })
    const seatsw=Object.values(freeSeats).filter((el: any) =>!Object.values(busy_seats).includes(el))
    console.log(typeof seatsw)
    return res.status(200).json({free:seatsw});
  } else {
    return res.status(500).send("Not logged in");
  }
};

export const book = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collectionSeats = db.collection("Seats");
  const collection = db.collection("Users");
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

  const loggedin = await collection.findOne({ token:req.headers.token });
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
    const notFree = await collectionSeats.findOne({ day, month, year, number });
    if (notFree) {
      return res.status(500).send("Seat is not free");
    }

    const tokenRet = uuid();
    await collectionSeats.insertOne({ day, month, year, number, username:loggedin.username });

    return res.status(200).json({ number,tokenRet });
  } else {
    return res.status(500).send(`Not  Logged in ${loggedin} ${token}`)
  }
};

export const free = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("Seats");
  const collectionUsers = db.collection("Users");
  let loggedusername: string = "unknown"
  let bookusername: string = "unknown"
  if (!req.query) {
    return res.status(500).send("No params");
  }
  const { token } = req.headers as {
    token: string;
  };
  const { day, month, year } = req.body as {
    day: string;
    month: string;
    year: string;
  };
  const loggedin = await collectionUsers.findOne({ token })
  if (!token) {
    return res.status(500).send("No login token");
  }
  if (!day || !month || !year ) {
    return res
      .status(500)
      .send("Missing day, month or year or seat number or token");
  }

  if (!checkDateValidity(day, month, year)) {
    return res.status(500).send("Invalid day, month or year");
  }
  if (loggedin) {
    const booked = await collection.findOne({ day, month, year});
    if (booked) {
      if (loggedin.username == booked.username) {
        await collection.deleteOne({ day, month, year });
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
  const collectionUsers = db.collection("Users");
  let future_dates :string="unknown";
  const { token } = req.headers as {
    token: string;
  };
  if (!req.headers) {
    return res.status(500).send("No params");
  }

  const loggedin = await collectionUsers.findOne({ token })
  if (!token) {
    return res.status(500).send("No login token");
  }
  if (loggedin) {
    const seats = await collection.find({ username:loggedin.username }).toArray();
    let future_seats:any;
    if(seats){
       seats.map(function(s){
        if(new Date().getTime() < new Date(s.year,s.month-1,s.day).getTime()){
          future_dates= (s.day+"-"+s.month+"-"+s.year)
        }
      })
       future_seats=await collection.find({day:future_dates.split("-")[0],month:future_dates.split("-")[1],year:future_dates.split("-")[2], username:loggedin.username }).toArray();
    }
    if(future_seats.length>0){
      return res.status(200).json({ myseats: future_seats });
    }
    else return res.status(404).send("No future bookings");
  } else {
    return res.status(500).send("Not logged in");
  }
};

