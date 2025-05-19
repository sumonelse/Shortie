import createHttpError from "http-errors"
import { nanoid } from "nanoid"
import urlModel from "./urlModel.js"

const shortOriginalURL = async (req, res, next) => {
    const { longURL, customSlug } = req.body
    // console.log("longURL", longURL, "customSlug", customSlug)

    if (!longURL) {
        return next(createHttpError(400, "Please enter a url"))
    }

    try {
        // Validate URL format first
        try {
            new URL(longURL)
        } catch (error) {
            return next(createHttpError(400, "Please enter a valid URL format"))
        }

        // Try to fetch the URL to verify it exists
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

            const response = await fetch(longURL, {
                method: "HEAD",
                signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                return next(
                    createHttpError(
                        400,
                        "The URL exists but returned an error response"
                    )
                )
            }
        } catch (fetchError) {
            // If fetch fails, we'll still allow the URL but log the error
            console.warn(
                `URL validation warning for ${longURL}: ${fetchError.message}`
            )
            // We don't return an error here, allowing URLs that might be valid but don't respond to HEAD requests
        }

        // If a custom slug is provided, check if it's already in use
        if (customSlug) {
            // Validate custom slug format (only letters, numbers, hyphens, and underscores)
            const slugPattern = /^[a-zA-Z0-9_-]+$/
            if (!slugPattern.test(customSlug)) {
                return next(
                    createHttpError(
                        400,
                        "Custom slug can only contain letters, numbers, hyphens, and underscores"
                    )
                )
            }

            // Check if the custom slug already exists
            const existingSlug = await urlModel.findOne({
                shortCode: customSlug,
            })
            if (existingSlug) {
                return next(
                    createHttpError(
                        409,
                        "This custom slug is already in use. Please try another one."
                    )
                )
            }

            // Create URL with custom slug
            const url = await urlModel.create({
                shortCode: customSlug,
                originalUrl: longURL,
            })

            return res.status(200).json({
                success: true,
                shortURL: url,
            })
        }

        // If no custom slug, generate a random one
        const MAX_ATTEMPTS = 5 // Setting a limit to avoid infinite loops
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
