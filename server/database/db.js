import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBConnection = async () => {
  const MONGO_URI = process.env.MONGODB_URL;

  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB Connected Successfully!!");
  } catch (err) {
    console.log("Error Connecting Database", err.message);
  }
};

export default DBConnection;
