import React from "react"
import Shortener from "./components/Shortener"
import "./stylesheets/App.css"
import { ShortenerProvider } from "./context/ShortenerContext"

const App = () => {
    return (
        <div className="main-container flex flex-col justify-center items-center">
            <ShortenerProvider>
                <Shortener />
            </ShortenerProvider>
        </div>
    )
}

export default App
