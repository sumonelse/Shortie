import express from "express"
import { shortURL } from "./urlController.js"

const urlRouter = express.Router()

// ROUTES
urlRouter.post("/short", shortURL)

export default urlRouter
