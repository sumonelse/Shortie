import app from "./src/app.js"
import { config } from "./src/config/config.js"
import connectDB from "./src/config/db.js"

const startServer = async () => {
    try {
        // Connect to database
        await connectDB()

        const port = config.port || 5500

        // Start the server
        const server = app.listen(port, () => {
            console.log(`Server started on PORT: ${port}`)
        })

        // Handle server errors
        server.on("error", (error) => {
            console.error("Server error:", error)
            process.exit(1)
        })

        // Handle unhandled promise rejections
        process.on("unhandledRejection", (reason, promise) => {
            console.error("Unhandled Rejection at:", promise, "reason:", reason)
            // Close server & exit process
            server.close(() => process.exit(1))
        })
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

startServer()
