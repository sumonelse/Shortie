import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import "./utils.css"

// Register service worker for PWA support
const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("/serviceWorker.js")
                .then((registration) => {
                    console.log(
                        "ServiceWorker registration successful with scope: ",
                        registration.scope
                    )
                })
                .catch((error) => {
                    console.log("ServiceWorker registration failed: ", error)
                })
        })
    }
}

// Initialize the app
const initApp = () => {
    createRoot(document.getElementById("root")).render(
        <StrictMode>
            <App />
        </StrictMode>
    )

    // Register service worker in production
    if (import.meta.env.PROD) {
        registerServiceWorker()
    }
}

initApp()
