import app from "./src/app.js"
import { config } from "./src/config/config.js"
import connectDB from "./src/config/db.js"

const startServer = async () => {
    await connectDB()

    const port = config.port || 5500

    app.listen(port, () => {
        console.log(`Server started on PORT: ${port}`)
    })
}

startServer()
