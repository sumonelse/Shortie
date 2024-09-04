import React, { useRef } from "react"

import "../stylesheets/Shortener.css"
import URLForm from "./URLForm"
import { useShortenerContext } from "../context/ShortenerContext"

const Shortener = () => {
    const { shortURL } = useShortenerContext()
    const urlRef = useRef(null)

    const copyToClipboard = () => {
        urlRef.current?.select()
        window.navigator.clipboard.writeText(shortURL)
    }

    return (
        <div className="shortener-wrapper flex flex-col shadow main-br">
            <div className="intro flex flex-col">
                <h1>Short your LOOONG Link</h1>
                <p className="sub">No credit card required.</p>
            </div>

            <URLForm />

            {shortURL.length > 0 && (
                <div className="flex all-center mx-auto">
                    <input
                        type="text"
                        value={shortURL}
                        readOnly
                        className="main-pd url-input"
                        ref={urlRef}
                    />
                    <button className="btn" onClick={copyToClipboard}>
                        Copy
                    </button>
                </div>
            )}
        </div>
    )
}

export default Shortener
