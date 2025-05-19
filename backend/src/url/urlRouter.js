import express from "express"
import { shortOriginalURL, getOriginalURL } from "./urlController.js"
import { validateUrlRequest } from "../middlewares/validateRequest.js"

const urlRouter = express.Router()

// ROUTES
urlRouter.post("/short", validateUrlRequest, shortOriginalURL)
urlRouter.get("/:shortCode", getOriginalURL)

export default urlRouter
