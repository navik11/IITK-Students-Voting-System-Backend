import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

export default app;
