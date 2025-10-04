import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "../config/env.js";

if (!MONGODB_URI) {
  throw new Error(
    `MONGODB_URI is not defined in environment variables inside .env.${NODE_ENV}.local file`
  );
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB", { env: NODE_ENV });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error, { env: NODE_ENV });
    process.exit(1);
  }
};

export default connectToDatabase;
