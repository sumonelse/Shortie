import express from "express"
import { shortOriginalURL, getOriginalURL } from "./urlController.js"

const urlRouter = express.Router()

// ROUTES
urlRouter.post("/short", shortOriginalURL)
urlRouter.get("/:shortCode", getOriginalURL)

export default urlRouter
