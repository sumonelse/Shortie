import express from "express"
import globalEventHandler from "./middlewares/globalEventHandler.js"
import urlRouter from "./url/urlRouter.js"

const app = express()

app.get("/", (req, res) => {
    res.json({
        name: "Sumit",
    })
})

app.use("/api/url", urlRouter)

// GLOBAL ERROR HANDLER
app.use(globalEventHandler)

export default app
