import { config as conf } from "dotenv"
conf()

// Validate required environment variables
const requiredEnvVars = ["MONGO_CONNECTION_URL", "FRONTEND_DOMAIN"]
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
    console.error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}`
    )
    process.exit(1)
}

const _config = {
    port: process.env.PORT || 5500,
    dbURL: process.env.MONGO_CONNECTION_URL,
    env: process.env.NODE_ENV || "development",
    frontendDomain: process.env.FRONTEND_DOMAIN,
}

export const config = Object.freeze(_config)
