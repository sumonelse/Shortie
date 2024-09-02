const mongoose = require("mongoose")

// Define the schema for the URL shortener
const urlSchema = new mongoose.Schema({
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
})

// Create a model from the schema
const Url = mongoose.model("Url", urlSchema)

module.exports = Url
