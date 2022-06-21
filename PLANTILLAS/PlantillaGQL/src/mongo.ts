import { Db, MongoClient } from "mongodb";
import * as dotenv from "dotenv";

export const connectDB = async (): Promise<Db> => {
  dotenv.config();
  const db_user = process.env.DB_USER;
  const db_password = process.env.DB_PASSWORD;
  const db_cluster = process.env.DB_CLUSTER;
  const mongouri: string = `mongodb+srv://${db_user}:${db_password}@${db_cluster}/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(mongouri);
  try {
    await client.connect();
    console.info("MongoDB connected");
    return client.db("Sample");
  } catch (e) {
    throw e;
  }
};
