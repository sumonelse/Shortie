import express from "express"
import globalEventHandler from "./middlewares/globalEventHandler.js"

const app = express()

app.get("/", (req, res) => {
    res.json({
        name: "Sumit",
    })
})

// GLOBAL ERROR HANDLER
app.use(globalEventHandler)

export default app
