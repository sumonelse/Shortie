import React from "react"
import Shortener from "./Shortener"
import { ShortenerProvider } from "../context/ShortenerContext"

const URLShortener = () => {
    return (
        <div className="main-container flex flex-col justify-center items-center">
            <ShortenerProvider>
                <Shortener />
            </ShortenerProvider>
        </div>
    )
}

export default URLShortener
