import React from "react"
import { Toaster } from "react-hot-toast"
import Shortener from "./Shortener"
import { ShortenerProvider } from "../context/ShortenerContext"
import Logo from "./Logo"

const URLShortener = () => {
    return (
        <div className="main-container flex flex-col justify-center items-center">
            <ShortenerProvider>
                <header className="app-header">
                    <div className="flex items-center justify-center mb-3">
                        <Logo size="xlarge" color="primary" />
                    </div>
                    <h1>
                        <span
                            className="text-primary-color"
                            style={{ color: "var(--primary-color)" }}
                        >
                            Shortie - An URL SHORTENER
                        </span>
                    </h1>
                    <p>
                        Transform long, unwieldy links into clean, manageable
                        URLs in seconds
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
