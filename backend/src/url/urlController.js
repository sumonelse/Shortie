import createHttpError from "http-errors"
import { nanoid } from "nanoid"
import urlModel from "./urlModel.js"

const shortURL = async (req, res, next) => {
    const { longURL } = req.body
    console.log("longURL", longURL)

    if (!longURL) {
        return next(createHttpError(400, "Please enter a url"))
    }

    try {
        const response = await fetch(longURL, { method: "HEAD" }) // Using HEAD to check existence
        if (!response.ok) {
            return next(
                createHttpError(
                    400,
                    "The provided URL does not exist or is unreachable"
                )
            )
        }

        const MAX_ATTEMPTS = 5 // Seting a limit to avoid infinite loops
        let attempts = 0
        let url = ""
        let urlLen = 10

        while (attempts < MAX_ATTEMPTS) {
            const shortCode = nanoid(urlLen)
            const shortCodeExist = await urlModel.findOne({ shortCode })

            if (!shortCodeExist) {
                url = await urlModel.create({
                    shortCode,
                    originalUrl: longURL,
                })
                break
            }

            attempts += 1
            urlLen += 1 // Increasing the length of the short url so that chances of future collisions are minimized
        }

        if (!url) {
            const error = createHttpError(
                500,
                "Could not generate a unique short code. PLEASE TRY AGAIN:)"
            )
            return next(error)
        }

        res.status(201).json({
            message: "Url Shorted successfully",
            shortURL: url,
        })
    } catch (error) {
        console.error("Error fetching URL:", error)
        const httpError = createHttpError(500, "Internal server error")
        next(httpError)
    }
}

export { shortURL }
