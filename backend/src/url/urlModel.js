import mongoose from "mongoose"

// Define the schema for the URL shortener
const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true,
        },
        shortCode: {
            type: String,
            required: true,
            unique: true, // Ensure the short code is unique
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { versionKey: false }
)

// Create a model from the schema
const urlModel = mongoose.model("Url", urlSchema)

export default urlModel
