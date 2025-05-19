import React, { useState } from "react"
import toast from "react-hot-toast"
import { useShortenerContext } from "../context/ShortenerContext"

const createShortURL = async (longURL, setShortURL, addToHistory) => {
    try {
        // Validate URL format
        if (!longURL.match(/^(http|https):\/\/[^ "]+$/)) {
            toast.error(
                "Please enter a valid URL including http:// or https://"
            )
            return false
        }

        const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN
        const endpoint = `${backendDomain}/api/url/short`
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ longURL }),
        })

        if (!res.ok) {
            throw new Error("Server responded with an error")
        }

        const data = await res.json()
        const shortCode = data.shortURL.shortCode
        const fullShortUrl = `https://shortie-9fgs.onrender.com/${shortCode}`

        toast.success("URL shortened successfully!", {
            icon: "🔗",
            duration: 4000,
        })

        setShortURL(fullShortUrl)

        // Add to history
        addToHistory(longURL, fullShortUrl)

        return true
    } catch (error) {
        console.error("Error shortening URL:", error)
        toast.error("Failed to shorten the URL. Please try again.")
        return false
    }
}

const URLForm = ({ setLoading }) => {
    const [longURL, setLongURL] = useState("")
    const [isValidURL, setIsValidURL] = useState(true)
    const { setShortURL, addToHistory, setIsLoading } = useShortenerContext()

    const validateURL = (url) => {
        const pattern = /^(http|https):\/\/[^ "]+$/
        return pattern.test(url)
    }

    const handleURLChange = (e) => {
        const url = e.target.value
        setLongURL(url)

        // Only validate if there's input
        if (url.length > 0) {
            setIsValidURL(validateURL(url))
        } else {
            setIsValidURL(true)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateURL(longURL)) {
            setIsValidURL(false)
            toast.error(
                "Please enter a valid URL including http:// or https://"
            )
            return
        }

        setLoading(true)
        setIsLoading(true)

        const success = await createShortURL(longURL, setShortURL, addToHistory)

        if (success) {
            setLongURL("")
        }

        setLoading(false)
        setIsLoading(false)
    }

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setLongURL(text)

            // Validate the pasted URL
            if (text.length > 0) {
                setIsValidURL(validateURL(text))
            }
        } catch (err) {
            console.error("Failed to read clipboard contents: ", err)
            toast.error("Unable to paste from clipboard")
        }
    }

    return (
        <form
            className="flex flex-col w-full"
            method="POST"
            onSubmit={handleSubmit}
        >
            <div className="input-wrapper flex flex-col">
                <label htmlFor="longURL" className="mb-2">
                    <h3>Paste your long URL here</h3>
                </label>
                <div className="flex justify-center flex-col gap-3 md:flex-row">
                    <div className="flex-grow relative">
                        <div className="relative">
                            <input
                                type="text"
                                id="longURL"
                                name="longURL"
                                placeholder="https://example.com/your-long-url-goes-here"
                                required
                                className={`url-input w-full pr-10 ${
                                    !isValidURL ? "border-red-500" : ""
                                }`}
                                value={longURL}
                                onChange={handleURLChange}
                                aria-invalid={!isValidURL}
                                aria-describedby={
                                    !isValidURL ? "url-error" : undefined
                                }
                            />
                            {longURL.length === 0 && (
                                <button
                                    type="button"
                                    onClick={handlePaste}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    title="Paste from clipboard"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        {!isValidURL && (
                            <p
                                id="url-error"
                                className="text-red-500 text-sm mt-1"
                            >
                                Please enter a valid URL (include http:// or
                                https://)
                            </p>
                        )}
                    </div>
                    <button type="submit" className="btn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Shorten URL
                    </button>
                </div>
            </div>
            <div className="mt-3 text-sm text-gray-500">
                <p>
                    Enter any long URL and get a shortened, easy-to-share link
                </p>
            </div>
        </form>
    )
}

export default URLForm
