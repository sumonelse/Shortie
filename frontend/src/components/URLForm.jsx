import React, { useState } from "react"
import { useShortenerContext } from "../context/ShortenerContext"

const createShortURL = async (longURL, setShortURL) => {
    try {
        const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN
        const endpoint = `${backendDomain}/api/url/short`
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ longURL }),
        })

        const data = await res.json()
        const shortCode = data.shortURL.shortCode

        setShortURL(`https://shortie-9fgs.onrender.com/${shortCode}`)
    } catch (error) {
        console.log(error)
    }
}

const URLForm = ({ setLoading }) => {
    const [longURL, setLongURL] = useState("")
    const { setShortURL } = useShortenerContext()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        await createShortURL(longURL, setShortURL)
        setLongURL("")
        setLoading(false)
    }

    return (
        <form className="flex flex-col" method="POST" onSubmit={handleSubmit}>
            <div className="input-wrapper flex flex-col">
                <label htmlFor="longURL">
                    <h3>Paste your long link here</h3>
                </label>
                <div className="flex justify-center flex-col gap-2 md:flex-row">
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
