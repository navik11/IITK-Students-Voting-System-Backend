import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import routes here

import candidateRouter from "./routes/candidates.route.js";
import gbmRoute from "./routes/gbm.route.js";
import adminRoute from "./routes/admin.route.js";

//routes use declaration
app.get("/", (req, res) => {
    res.json("Server is live");
});
app.use("/api/v1/candidate", candidateRouter);
app.use("/api/v1/gbm", gbmRoute);
app.use("/api/v1/admin", adminRoute);


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
