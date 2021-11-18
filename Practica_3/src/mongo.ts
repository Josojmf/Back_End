import { Db, MongoClient } from "mongodb";

export const connectDB = async (): Promise<Db> => {
  const usr = "joso";
  const pwd = "123456abc";
  const dbName: string = "MyDbBackend";
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
