import dotEnv from "dotenv";
dotEnv.config();


export const PORT = process.env.PORT || 8000;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
// export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
