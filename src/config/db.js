// Logging Helper
export const log = (...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
};
import dotenv from "dotenv";
dotenv.config();
// ------------------ MongoDB ------------------
import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "node-boilerplate",
    });
    log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed  ", error);
    process.exit(1);
  }
};

// ------------------ MySQL ------------------
import mysql from "mysql2/promise";

export const connectMySQLDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "yourpassword",
      database: "yourdb",
    });
    log("MySQL Connected ✅");
    return connection;
  } catch (error) {
    console.error("MySQL connection failed  ", error);
    process.exit(1);
  }
};



