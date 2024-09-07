import React from "react"
import { Toaster } from "react-hot-toast"
import Shortener from "./Shortener"
import { ShortenerProvider } from "../context/ShortenerContext"

const URLShortener = () => {
    return (
        <div className="main-container flex flex-col justify-center items-center">
            <ShortenerProvider>
                <Shortener />
                <Toaster position="bottom-right" />
            </ShortenerProvider>
        </div>
    )
}

export default URLShortener
