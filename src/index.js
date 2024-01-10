import dotenv from "dotenv";
import { app }from "./app.js";

import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";

dotenv.config();

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

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5667, () => {
            console.log(`Sever is live at port: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(`MongoDB connection failed`);
    });

// import express from "express"

// const app = express()
// const PORT = 8000

// app.get('/', (req, res) => {
//   res.send('Hello World')
// })

// app.get('/about', (req, res) => {
//   res.send('About route 🎉 ')
// })

// app.listen(PORT, () => {
//     console.log(`✅ Server is running on port ${PORT}`);
//   })
  