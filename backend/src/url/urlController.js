import createHttpError from "http-errors"
import { nanoid } from "nanoid"
import urlModel from "./urlModel.js"
import { createClient } from "redis"

// Redis client configuration
let redisClient = null
let redisEnabled = false

// Initialize Redis if REDIS_URL is provided or in development environment
const initRedis = async () => {
    try {
        // Check for Redis URL in environment variables
        const redisUrl = process.env.REDIS_URL || process.env.REDIS_TLS_URL

        if (redisUrl) {
            // Connect to external Redis service
            redisClient = createClient({
                url: redisUrl,
                socket: {
                    tls: process.env.REDIS_TLS_URL ? true : false,
                    rejectUnauthorized: false,
                },
            })
        } else if (process.env.NODE_ENV === "development") {
            // Use local Redis in development
            redisClient = createClient()
        }

        if (redisClient) {
            // Set up event handlers
            redisClient.on("connect", () => {
                console.log("Redis client connected")
                redisEnabled = true
            })

            redisClient.on("error", (err) => {
                console.error("Redis client error:", err)
                redisEnabled = false
            })

            redisClient.on("end", () => {
                console.warn("Redis connection closed")
                redisEnabled = false
            })

            // Connect to Redis
            await redisClient.connect()
        } else {
            console.log("Redis not configured - running without cache")
        }
    } catch (err) {
        console.error("Redis initialization error:", err)
        redisEnabled = false
    }
}

// Initialize Redis
initRedis().catch((err) => {
    console.error("Failed to initialize Redis:", err)
    redisEnabled = false
})

// Helper functions for Redis operations with fallbacks
const getFromCache = async (key) => {
    if (!redisEnabled || !redisClient) return null
    try {
        return await redisClient.get(key)
    } catch (error) {
        console.warn(`Redis get failed for key ${key}:`, error)
        return null
    }
}

const setInCache = async (key, value, options = {}) => {
    if (!redisEnabled || !redisClient) return false
    try {
        await redisClient.set(key, value, options)
        return true
    } catch (error) {
        console.warn(`Redis set failed for key ${key}:`, error)
        return false
    }
}

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
            const cachedSlug = await getFromCache(`slug:${customSlug}`)
            if (cachedSlug) {
                return next(
                    createHttpError(
                        409,
                        "This custom slug is already in use. Please try another one."
                    )
                )
            }

            // Check database if not in cache
            const existingSlug = await urlModel.findOne({
                shortCode: customSlug,
            })

            if (existingSlug) {
                // Cache the result for future lookups
                await setInCache(
                    `slug:${customSlug}`,
                    existingSlug.originalUrl,
                    {
                        EX: 3600, // Cache for 1 hour
                    }
                )

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
            await setInCache(`slug:${customSlug}`, longURL, {
                EX: 3600, // Cache for 1 hour
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

            // Check Redis cache first
            let shortCodeExist = false
            const cachedUrl = await getFromCache(`slug:${shortCode}`)
            shortCodeExist = !!cachedUrl

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
                await setInCache(`slug:${shortCode}`, longURL, {
                    EX: 3600, // Cache for 1 hour
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
        // Check Redis cache first
        const cachedUrl = await getFromCache(`slug:${shortCode}`)
        if (cachedUrl) {
            return res.status(200).json({
                success: true,
                originalURL: cachedUrl,
                shortCode: shortCode,
                fromCache: true,
            })
        }

        // If not in cache, check database
        const url = await urlModel.findOne({ shortCode })

        if (!url) {
            console.warn(`Short code not found: ${shortCode}`)
            return next(createHttpError(404, "Short code not found"))
        }

        // Cache the result for future lookups
        await setInCache(`slug:${shortCode}`, url.originalUrl, {
            EX: 3600, // Cache for 1 hour
        })

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
