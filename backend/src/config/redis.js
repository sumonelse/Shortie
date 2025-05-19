import { config } from "./config.js"

// Redis configuration
export const redisConfig = {
    // Check for Redis URL in environment variables
    url: config.redisUrl || null,

    // Default expiration time for cache entries (in seconds)
    defaultExpiry: 3600,

    // Whether to use TLS for Redis connection
    useTls: config.redisUrl && config.redisUrl.includes("rediss://"),

    // Whether Redis is enabled
    enabled: !!config.redisUrl || config.env === "development",
}

export default redisConfig
