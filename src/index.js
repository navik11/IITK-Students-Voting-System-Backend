import dotenv from "dotenv";
// import connectDB from "./db/index.js";
import { app }from "./app.js";

dotenv.config();



// connectDB()
//     .then(() => {
        app.listen(process.env.PORT || 5667, () => {
            console.log(`Sever is live at port: ${process.env.PORT}`);
        });
//     })
//     .catch((error) => {
//         console.log(`MongoDB connection failed`);
//     });

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
  