import React, { useState } from "react"
import { useShortenerContext } from "../context/ShortenerContext"

const createShortURL = async (longURL, setShortURL) => {
    try {
        const endpoint = "http://localhost:3000/api/url/short"
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ longURL }),
        })

        const data = await res.json()
        const shortCode = data.shortURL.shortCode

        setShortURL(`http://localhost:5173/${shortCode}`)
    } catch (error) {
        console.log(error)
    }
}

const URLForm = () => {
    const [longURL, setLongURL] = useState("")
    const { setShortURL } = useShortenerContext()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await createShortURL(longURL, setShortURL)
    }

    return (
        <form className="flex flex-col" method="POST" onSubmit={handleSubmit}>
            <div className="input-wrapper flex flex-col">
                <label htmlFor="longURL">
                    <h3>Paste your long link here</h3>
                </label>
                <div className="flex">
                    <input
                        type="text"
                        id="longURL"
                        name="longURL"
                        placeholder="https://example.com/long-url"
                        required
                        className="main-pd url-input"
                        value={longURL}
                        onChange={(e) => {
                            setLongURL(e.target.value)
                        }}
                    />
                    <input type="submit" className="btn" value="Shorten Link" />
                </div>
            </div>
        </form>
    )
}

export default URLForm
