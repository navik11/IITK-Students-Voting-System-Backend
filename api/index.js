import app from "../src/app.js"

app.get("/", (req, res) => {
    res.json({"message": "Server is liveee"})
})

export default app