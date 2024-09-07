import createHttpError from "http-errors"
import { nanoid } from "nanoid"
import urlModel from "./urlModel.js"

const shortOriginalURL = async (req, res, next) => {
    const { longURL } = req.body
    // console.log("longURL", longURL)

    if (!longURL) {
        return next(createHttpError(400, "Please enter a url"))
    }

    try {
        const response = await fetch(longURL, { method: "HEAD" }) // Using HEAD to check existence

        if (!response.ok) {
            return next(createHttpError(400, "Please, enter a valid URL"))
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

        res.status(200).json({
            success: true,
            shortURL: url,
        })
    } catch (error) {
        console.error("Error Creating original URL: ", error)
        const httpError = createHttpError(500, "Internal server error")
        next(httpError)
    }
}

const getOriginalURL = async (req, res, next) => {
    const { shortCode } = req.params

    try {
        const url = await urlModel.findOne({ shortCode })

        if (!url) {
            console.warn(`Short code not found: ${shortCode}`)
            return next(createHttpError(404, "Short code not found"))
        }

        res.status(200).json({
            success: true,
            originalURL: url.originalUrl,
            shortCode: shortCode,
        })
    } catch (error) {
        console.error("Error fetching URL:", error)
        const httpError = createHttpError(500, "Internal server error")
        next(httpError)
    }
}

export { shortOriginalURL, getOriginalURL }
