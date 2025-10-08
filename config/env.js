import { config } from "dotenv";

// Load base .env file first to get NODE_ENV
config({ path: ".env" });

// Then load environment-specific file
config({ path: `.env.${process.env.NODE_ENV}.local` });

export const { 
    PORT, 
    NODE_ENV, 
    MONGODB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ARCJET_API_KEY,
    ARCJET_ENV
} = process.env;
