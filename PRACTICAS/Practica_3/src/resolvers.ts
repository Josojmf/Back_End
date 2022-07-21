//Done by José María Fernández Gómez 2022
import { Request, Response } from "express";
import { Db } from "mongodb";
import { v4 as uuid } from "uuid";
import bodyParser from "body-parser";
import { stringify } from "querystring";
import { type } from "os";
const brcypt = require("bcrypt");

//Function to check if the date is formatted correctly
const checkDateValidity = (
  day: string,
  month: string,
  year: string
): boolean => {
  const date = new Date(`${month} ${day}, ${year}`);
  return date.toString() !== "Invalid Date";
};
//Endopint to return server status, if everything OK returns current date
export const status = async (req: Request, res: Response) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  res.status(200).send(`${day}-${month}-${year}`);
};

//Sign in endpoint
export const signin = async (req: Request, res: Response) => {

  const db: Db = req.app.get("db");//get the db from env
  const collection = db.collection("Users"); //Set collection to Users
  if (!req.body) {
    return res.status(500).send("No params"); //If the request has no params return error
  }

  let { username, password } = req.body as { //Get credentials to variables
    username: string;
    password: string;
  }

  if (!username || !password) { //Check if all params are supplied
    console.log(req.body)
    return res.status(500).send(`No username or password `);
  }
  const user = await collection.findOne({ username }); //Check if username is not in use
  if (user) {
    return res.status(409).send("Username already in use")
  } else {
    password = brcypt.hashSync(password, 10); //Hash the password
    await collection.insertOne({ username, password, token:null });//Upload User object to DB, setting the token to null to indicate that the user is not logged in
    return res.status(200).send("Signed in")//Return confirmation message
  }
}
//Login endpoint
export const login = async (req: Request, res: Response) => {
 
  const db: Db = req.app.get("db"); //Get the db from env
  const collection = db.collection("Users"); // Set collection to Users
  if (!req.query) {
    return res.status(500).send("No params"); //If the request has no params return error
  }

  const { username, password } = req.body as { // Get credentials to variables
    username: string;
    password: string;
  }

  if (!username || !password) { // If username or password is not supplied return error
    return res.status(500).send("No username or password");
  }
  const user = await collection.findOne({username:username}); //Find username in DB
  if (user) { //If username exists
    if (brcypt.compareSync(password, user.password)){ //Compare the hasshed password with the provided one 
      if(user.token!=null){ //If the token is not null means the user is active 
        res.status(500).send(`Already logged in, your token is ${user.token}`) //Token reminder
      } else { //The user exists, the pwd is correct ans it is not active
        const token = uuid(); //Create a new token
        await collection.updateOne({ username }, { $set: { token:token } }); //Set the token to the newly created one
        return res.status(200).send(`Logged in ${token}`);//Confirmation message
      }
      //Error handling
    }else{
      return res.status(401).send("Incorrect username or password")
    }     
  } else {
    return res.status(401).send("Incorrect username or password");
  }
}
//LogOut endpoint
export const logout = async (req: Request, res: Response) => {

  const db: Db = req.app.get("db"); //Get the db from env
  const collection = db.collection("Users");// Set collection to Users
  if (!req.query) { //If the request has no params return error
    return res.status(500).send("No params");
  }
  const active = await collection.findOne({ token:req.headers.token });//Check if there is any user with that secret token
  if (active) { // If there is a user with that secret token means the user is logged in
    await collection.updateOne({token:req.headers.token},{$set:{ token:null} }); //We set token to null meaning the user is not logged in
    return res.status(200).send(`Logged out ${active.username}`); //Goodbye message
  } else {
    //Error handling
    return res.status(401).send(`This user is not active or not found`);
  }
}
//Freeseats endpoint
export const freeSeats = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db"); // Get  the db from env
  const collection = db.collection("Users"); // Set collection to Users
  const collectionSeats = db.collection("Seats");// Set collection to Seats
  const { token } = req.headers as { // Get the token from headers
    token: string;
  };
  const { day, month, year } = req.query as { // Get the date from query
    day: string;
    month: string;
    year: string;
  };
  if (!req.query) { //If the request has no params return error
    return res.status(500).send("No params");
  }
  const loggedin = await collection.findOne({ token:req.headers.token }); //Check if the user is logged in
  if (!token) {//If the request has no token return error
    return res.status(500).send("No login token");
  }
  if (!day || !month || !year) { //If the request has no date return error
    return res.status(500).send("Missing day, month or year");
  }

  if (!checkDateValidity(day, month, year)) { // If the date is not formatted correctly return error
    return res.status(500).send("Invalid day, month or year");
  }
  if (loggedin) { // If the user is logged in
    let freeSeats : string[]=[]; // Init a empty temp array 
    for (let i = 1; i <= 20; i++) {
      freeSeats.push(i.toString()); // Add all the seats to the temp array (1-20)
    }
    const seats = await collectionSeats.find({ day, month, year }).toArray();// Get all the seats from the DB
    const busy_seats=seats.map(function(s){ //Get just the number of the busy seats
      return(s.number)
    })
    const seatsw=Object.values(freeSeats).filter((el: any) =>!Object.values(busy_seats).includes(el)) //Filter the temp array to get the free seats
    return res.status(200).json({free:seatsw});//Return only the free seats
  } else {
    //Error handling
    return res.status(500).send("Not logged in");
  }
};

// Book seats endpoint
export const book = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db"); //Get the db from env
  const collectionSeats = db.collection("Seats"); // Set collection to Seats
  const collection = db.collection("Users");// Set collection to Users
  const { token } = req.headers as { // Get the token from headers
    token: string;
  };
  const { day, month, year, number } = req.query as { // Get the date from query
    day: string;
    month: string;
    year: string;
    number: string;
  };
  if (!req.query) { //If the request has no params return error
    return res.status(500).send("No params");
  }

  const loggedin = await collection.findOne({ token:req.headers.token });//Check if the user is logged in
  if (!token) { //If the request has no token return error
    return res.status(500).send("No login token");
  }
  if (!day || !month || !year || !number) { //If the request has no date return error
    return res.status(500).send("Missing day, month or year or seat number");
  }
  if (!checkDateValidity(day, month, year)) { // If the date is not formatted correctly return error
    return res.status(500).send("Invalid day, month or year");
  }
  if (loggedin) { // If the user is logged in
    const notFree = await collectionSeats.findOne({ day, month, year, number }); //Get the seat from the DB on that day 
    if (notFree) { //If this object exists means that the seat is busy
      return res.status(500).send("Seat is not free");
    }

    await collectionSeats.insertOne({ day, month, year, number, username:loggedin.username });//If the seat is free, upload doc to DB with my username to set the booking

    return res.status(200).json({ "Seat booked":number });//Confirmation message
  } else {
    //Error handling
    return res.status(500).send(`Not  Logged in ${loggedin} `)
  }
};

export const free = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db"); //Get the db from env
  const collection = db.collection("Seats"); // Set collection to Seats
  const collectionUsers = db.collection("Users");// Set collection to Users
  if (!req.query) { //If the request has no params return error
    return res.status(500).send("No params");
  }
  const { token } = req.headers as { // Get the token from headers
    token: string;
  };
  const { day, month, year } = req.body as { // Get the date from body
    day: string;
    month: string;
    year: string;
  };
  const loggedin = await collectionUsers.findOne({ token }); //Check if the user is logged in
  if (!token) { //If the request has no token return error
    return res.status(500).send("No login token");
  }
  if (!day || !month || !year ) { //If the request has no date return error
    return res
      .status(500)
      .send("Missing day, month or year or seat number or token");
  }

  if (!checkDateValidity(day, month, year)) { // If the date is not formatted correctly return error
    return res.status(500).send("Invalid day, month or year");
  }
  if (loggedin) { // If the user is logged in
    const booked = await collection.findOne({ day, month, year});//Check if any seat is booked that day 
    if (booked) { //If theres any seat booked that day
      if (loggedin.username == booked.username) { //Check if you have booked that seat
        await collection.deleteOne({ day, month, year });//If the seat was booked by you delete it from the DB
        return res.status(200).send("Seat is now free");// Confirmation message
      } else {
        return res.status(500).send("It's not your seat");//If the seat was booked by someone else return error
      }
    }
    return res.status(500).send("Seat is not booked"); //If there is no booked seats that day return error
  }
};

// Mybookings endpoint
export const myBookings = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db"); //Get the db from env
  const collection = db.collection("Seats"); 
  const collectionUsers = db.collection("Users"); // Set collection to Users
  let future_dates :string="unknown"; // Init a temp variable to store the future dates 
  const { token } = req.headers as { // Get the token from headers
    token: string;
  };
  if (!req.headers) { //If the request has no headers return error
    return res.status(500).send("No params");
  }

  const loggedin = await collectionUsers.findOne({ token }) ; //Check if the user is logged in
  if (!token) { //If the request has no token return error
    return res.status(500).send("No login token");
  }
  if (loggedin) { // If the user is logged in
    const seats = await collection.find({ username:loggedin.username }).toArray();//Get all the booked seats with my username
    let future_seats:any; // Init a temp variable to store the future seats
    if(seats){//If you have any booked seats
       seats.map(function(s){ //Check if the booking is in the future 
        if(new Date().getTime() < new Date(s.year,s.month-1,s.day).getTime()){
          future_dates= (s.day+"-"+s.month+"-"+s.year)
        }
      })
       future_seats=await collection.find({day:future_dates.split("-")[0],month:future_dates.split("-")[1],year:future_dates.split("-")[2], username:loggedin.username }).toArray();//Find the future booked seats by date
    }
    if(future_seats.length>0){//If there is any booked seats by you in the future
      return res.status(200).json({ myseats: future_seats });//Return only the future booked seats
    }
    else return res.status(404).send("No future bookings");// If there are no future booked seats return error
  } else {
    return res.status(500).send("Not logged in");// Error handling
  }
};

