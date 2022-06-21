import { Db, MongoClient } from "mongodb";
import * as dotenv from "dotenv";

export const connectDB = async (): Promise<Db> => {
  dotenv.config();
  const mongouri: string = "mongodb+srv://joso:123456j@cluster0.6xzff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(mongouri);

  try {
    await client.connect();
    console.info("MongoDB connected");
    return client.db("Chat");
  } catch (e) {
    throw e;
  }
};
