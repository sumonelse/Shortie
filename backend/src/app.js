import express from "express"
import cors from "cors"
import globalEventHandler from "./middlewares/globalEventHandler.js"
import urlRouter from "./url/urlRouter.js"
import { config } from "./config/config.js"

const app = express()

app.use(
    cors({
        origin: config.frontendDomain,
    })
)
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
