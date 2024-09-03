import express from "express"
import globalEventHandler from "./middlewares/globalEventHandler.js"
import urlRouter from "./url/urlRouter.js"

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.json({
        name: "Welcome to URL Shortener",
    })
})

app.use("/api/url", urlRouter)

// GLOBAL ERROR HANDLER
app.use(globalEventHandler)

export default app
