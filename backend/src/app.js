import express from "express"
import cors from "cors"
import compression from "compression"
import globalEventHandler, {
    notFoundHandler,
} from "./middlewares/globalEventHandler.js"
import urlRouter from "./url/urlRouter.js"
import { config } from "./config/config.js"

const app = express()

// Apply middleware
app.use(
    cors({
        origin: config.frontendDomain,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
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

// Add security headers
app.use((req, res, next) => {
    // Protect against XSS attacks
    res.setHeader("X-XSS-Protection", "1; mode=block")
    // Prevent MIME type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff")
    // Prevent clickjacking
    res.setHeader("X-Frame-Options", "DENY")
    // Strict Transport Security (use in production with HTTPS)
    if (config.env === "production") {
        res.setHeader(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains"
        )
    }
    next()
})

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
