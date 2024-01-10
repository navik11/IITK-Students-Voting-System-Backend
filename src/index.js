import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config();

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5667, () => {
            console.log(`Sever is live at port: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(`MongoDB connection failed`);
    });
