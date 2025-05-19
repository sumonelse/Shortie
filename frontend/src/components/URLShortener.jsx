import React from "react"
import { Toaster } from "react-hot-toast"
import Shortener from "./Shortener"
import { ShortenerProvider } from "../context/ShortenerContext"

const URLShortener = () => {
    return (
        <div className="main-container flex flex-col justify-center items-center">
            <ShortenerProvider>
                <header className="app-header">
                    <h1>URL Shortener</h1>
                    <p>
                        Transform long, unwieldy links into clean, manageable
                        URLs
                    </p>
                </header>
                <Shortener />
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: "#363636",
                            color: "#fff",
                            borderRadius: "8px",
                        },
                    }}
                />
            </ShortenerProvider>
        </div>
    )
}

export default URLShortener
