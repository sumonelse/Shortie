import createHttpError from "http-errors"
import { nanoid } from "nanoid"
import urlModel from "./urlModel.js"
import { createClient } from "redis"

// Create Redis client
const redisClient = createClient()

// Connect to Redis
redisClient.connect().catch((err) => {
    console.error("Redis connection error:", err)
})

// Redis connection event handlers
redisClient.on("connect", () => console.log("Redis client connected"))
redisClient.on("error", (err) => console.error("Redis client error:", err))

// URL validation using regex instead of network requests
const isValidUrl = (url) => {
    try {
        // Basic URL validation regex
        const urlPattern = new RegExp(
            "^(https?:\\/\\/)?" + // protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                "(\\#[-a-z\\d_]*)?$", // fragment locator
            "i"
        )
        return urlPattern.test(url)
    } catch (error) {
        console.error("URL validation error:", error)
        return false
    }
}

const shortOriginalURL = async (req, res, next) => {
    const { longURL, customSlug } = req.body

    try {
        // Validate URL format using regex
        if (!isValidUrl(longURL)) {
            return next(
                createHttpError(
                    400,
                    "Invalid URL format. Please provide a valid URL."
                )
            )
        }

        // If a custom slug is provided, check if it's already in use
        if (customSlug) {
            // Check Redis cache first
            try {
                const cachedSlug = await redisClient.get(`slug:${customSlug}`)
                if (cachedSlug) {
                    return next(
                        createHttpError(
                            409,
                            "This custom slug is already in use. Please try another one."
                        )
                    )
                }
            } catch (redisError) {
                console.warn("Redis cache check failed:", redisError)
                // Continue with database check if Redis fails
            }

            // Check database if not in cache
            const existingSlug = await urlModel.findOne({
                shortCode: customSlug,
            })

            if (existingSlug) {
                // Cache the result for future lookups
                try {
                    await redisClient.set(
                        `slug:${customSlug}`,
                        existingSlug.originalUrl,
                        {
                            EX: 3600, // Cache for 1 hour
                        }
                    )
                } catch (redisError) {
                    console.warn("Redis cache set failed:", redisError)
                }

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

            // Cache the new URL
            try {
                await redisClient.set(`slug:${customSlug}`, longURL, {
                    EX: 3600, // Cache for 1 hour
                })
            } catch (redisError) {
                console.warn("Redis cache set failed:", redisError)
            }

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

            // Check Redis cache first
            let shortCodeExist = false
            try {
                const cachedUrl = await redisClient.get(`slug:${shortCode}`)
                shortCodeExist = !!cachedUrl
            } catch (redisError) {
                console.warn("Redis cache check failed:", redisError)
            }

            // If not in cache, check database
            if (!shortCodeExist) {
                shortCodeExist = await urlModel.findOne({ shortCode })
            }

            if (!shortCodeExist) {
                url = await urlModel.create({
                    shortCode,
                    originalUrl: longURL,
                })

                // Cache the new URL
                try {
                    await redisClient.set(`slug:${shortCode}`, longURL, {
                        EX: 3600, // Cache for 1 hour
                    })
                } catch (redisError) {
                    console.warn("Redis cache set failed:", redisError)
                }

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
        // Check Redis cache first
        try {
            const cachedUrl = await redisClient.get(`slug:${shortCode}`)
            if (cachedUrl) {
                return res.status(200).json({
                    success: true,
                    originalURL: cachedUrl,
                    shortCode: shortCode,
                    fromCache: true,
                })
            }
        } catch (redisError) {
            console.warn("Redis cache get failed:", redisError)
            // Continue with database lookup if Redis fails
        }

        // If not in cache, check database
        const url = await urlModel.findOne({ shortCode })

        if (!url) {
            console.warn(`Short code not found: ${shortCode}`)
            return next(createHttpError(404, "Short code not found"))
        }

        // Cache the result for future lookups
        try {
            await redisClient.set(`slug:${shortCode}`, url.originalUrl, {
                EX: 3600, // Cache for 1 hour
            })
        } catch (redisError) {
            console.warn("Redis cache set failed:", redisError)
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
