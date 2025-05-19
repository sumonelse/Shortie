import express from "express"
import { rateLimit } from "express-rate-limit"
import { shortOriginalURL, getOriginalURL } from "./urlController.js"
import { validateUrlRequest } from "../middlewares/validateRequest.js"

const urlRouter = express.Router()

// Configure rate limiters
const createUrlLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60, // Limit each IP to 60 URL creations per window
    message: {
        success: false,
        message:
            "Too many URLs created from this IP, please try again after 15 minutes",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const getUrlLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Limit each IP to 100 URL retrievals per window
    message: {
        success: false,
        message:
            "Too many requests from this IP, please try again after 5 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
})

// ROUTES with rate limiting
urlRouter.post("/short", createUrlLimiter, validateUrlRequest, shortOriginalURL)
urlRouter.get("/:shortCode", getUrlLimiter, getOriginalURL)

export default urlRouter
