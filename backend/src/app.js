import express from "express"

const app = express()

app.get("/", (req, res) => {
    res.json({
        name: "Sumit",
    })
})

export default app
