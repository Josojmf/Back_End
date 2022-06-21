import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config()
export const connectDB = async (): Promise<Db> => {
  const dbName = process.env.DB_NAME;
  const usr = process.env.DB_USR;
  const pwd = process.env.DB_PWD;
  const mongouri: string = `  mongodb+srv://${usr}:${pwd}@cluster0.6xzff.mongodb.net/${dbName}?retryWrites=true&w=majority`;


  const client = new MongoClient(mongouri);

  try {
    await client.connect();
    console.info("MongoDB connected");

    return client.db(dbName);
  } catch (e) {
    throw e;
  }
};
