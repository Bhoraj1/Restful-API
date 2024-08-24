import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.CONNECTIONS;

const connection = () => {
  mongoose.connect(url) 
  .then(() =>{
     console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(`Error connecting : ${err}`);
  })
}

export default connection;