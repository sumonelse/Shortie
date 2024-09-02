import mongoose from "mongoose"
import { config } from "./config.js"

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Successfully connected to DATABASE")
        })

        mongoose.connection.on("error", (err) => {
            console.log("Error in connecting to DATABASE", err)
        })

        await mongoose.connect(config.dbURL)
    } catch (err) {
        console.log("Failed to connect to DATABASE")
        // process.exit(1)
    }
}

export default connectDB
