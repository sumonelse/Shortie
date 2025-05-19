import { config } from "../config/config.js"

const globalEventHandler = (err, req, res, next) => {
    // Get status code from error or default to 500
    const statusCode = err.statusCode || 500

    // Log error for server-side debugging
    console.error(`Error [${statusCode}]: ${err.message}`)
    if (config.env === "development") {
        console.error(err.stack)
    }

    // Prepare error response
    const errorResponse = {
        success: false,
        status: statusCode,
        message: err.message || "Internal Server Error",
    }

    // Only include stack trace in development environment
    if (config.env === "development") {
        errorResponse.errorStack = err.stack
    }

    // Send error response
    return res.status(statusCode).json(errorResponse)
}

// Handle 404 errors for routes that don't exist
export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    error.statusCode = 404
    next(error)
}

export default globalEventHandler
