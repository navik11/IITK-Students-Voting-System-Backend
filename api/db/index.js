import mongoose from "mongoose";
import { DB_NAME } from "../../src/constants.js";
import dotenv from "dotenv"

dotenv.config({path: "../../.env"})

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        console.log(
            `Mongodb connected !!\n DB Host ${connectionInstance.connection.host}`
        );
    } catch (err) {
        console.log(`MongoDB connection failed`, err);
        process.exit(1);
    }
};

export default connectDB;
