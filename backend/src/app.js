import express from "express"
import cors from "cors"
import compression from "compression"
import helmet from "helmet"
import globalEventHandler, {
    notFoundHandler,
} from "./middlewares/globalEventHandler.js"
import urlRouter from "./url/urlRouter.js"
import { config } from "./config/config.js"
import helmetConfig from "./config/helmet.js"

const app = express()

// Apply middleware
app.use(
    cors({
        origin: config.security.cors.allowedOrigins,
        methods: config.security.cors.allowedMethods,
        allowedHeaders: config.security.cors.allowedHeaders,
        exposedHeaders: config.security.cors.exposedHeaders,
        maxAge: config.security.cors.maxAge,
        credentials: true, // Allow cookies to be sent with requests
    })
)

// Compress all responses
app.use(
    compression({
        level: 6, // Compression level (0-9, where 9 is maximum compression but slower)
        threshold: 0, // Compress all responses regardless of size
        filter: (req, res) => {
            // Don't compress responses with this header
            if (req.headers["x-no-compression"]) {
                return false
            }
            // Use compression filter function from the module
            return compression.filter(req, res)
        },
    })
)

app.use(express.json())

// Add security headers with Helmet using our configuration
app.use(helmet(helmetConfig))

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        name: "Welcome to URL Shortener",
        status: "active",
        version: "1.0.0",
    })
})

// API routes
app.use("/api/url", urlRouter)

// 404 handler for undefined routes
app.use(notFoundHandler)

// Global error handler - must be last
app.use(globalEventHandler)

export default app
