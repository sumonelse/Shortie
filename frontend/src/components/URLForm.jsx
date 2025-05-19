import React, { useState } from "react"
import toast from "react-hot-toast"
import { useShortenerContext } from "../context/ShortenerContext"

const createShortURL = async (
    longURL,
    customSlug,
    setShortURL,
    addToHistory
) => {
    try {
        // Validate URL format
        if (!longURL.match(/^(http|https):\/\/[^ "]+$/)) {
            toast.error(
                "Please enter a valid URL including http:// or https://"
            )
            return false
        }

        const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN
        const frontendDomain = import.meta.env.VITE_FRONTEND_DOMAIN
        const endpoint = `${backendDomain}/api/url/short`

        // Prepare request body based on whether a custom slug is provided
        const requestBody = customSlug ? { longURL, customSlug } : { longURL }

        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })

        if (!res.ok) {
            // Parse the error response to get the detailed message
            const errorData = await res.json()
            throw new Error(
                errorData.message || "Server responded with an error"
            )
        }

        const data = await res.json()
        const shortCode = data.shortURL.shortCode
        const fullShortUrl = `${frontendDomain}/${shortCode}`

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
        // Display the specific error message from the server
        toast.error(
            error.message || "Failed to shorten the URL. Please try again."
        )
        return false
    }
}

const URLForm = ({ setLoading }) => {
    const [longURL, setLongURL] = useState("")
    const [customSlug, setCustomSlug] = useState("")
    const [showCustomSlug, setShowCustomSlug] = useState(false)
    const [isValidURL, setIsValidURL] = useState(true)
    const [isValidSlug, setIsValidSlug] = useState(true)
    const { setShortURL, addToHistory, setIsLoading } = useShortenerContext()

    const VITE_FRONTEND_DOMAIN = import.meta.env.VITE_FRONTEND_DOMAIN

    const validateURL = (url) => {
        const pattern = /^(http|https):\/\/[^ "]+$/
        return pattern.test(url)
    }

    const validateSlug = (slug) => {
        // Allow only letters, numbers, hyphens, and underscores
        const pattern = /^[a-zA-Z0-9_-]+$/
        return pattern.test(slug)
    }

    const handleSlugChange = (e) => {
        const slug = e.target.value
        setCustomSlug(slug)

        // Only validate if there's input
        if (slug.length > 0) {
            setIsValidSlug(validateSlug(slug))
        } else {
            setIsValidSlug(true)
        }
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

        // Validate custom slug if it's being used
        if (showCustomSlug && customSlug && !validateSlug(customSlug)) {
            setIsValidSlug(false)
            toast.error(
                "Custom slug can only contain letters, numbers, hyphens, and underscores"
            )
            return
        }

        setLoading(true)
        setIsLoading(true)

        // Only pass the custom slug if it's being shown and has a value
        const slugToUse = showCustomSlug && customSlug ? customSlug : null
        const success = await createShortURL(
            longURL,
            slugToUse,
            setShortURL,
            addToHistory
        )

        if (success) {
            setLongURL("")
            if (showCustomSlug) {
                setCustomSlug("")
            }
        }

        setLoading(false)
        setIsLoading(false)
    }

    const handlePaste = async () => {
        try {
            // Check if Clipboard API is available
            if (navigator.clipboard && navigator.clipboard.readText) {
                const text = await navigator.clipboard.readText()
                setLongURL(text)

                // Validate the pasted URL
                if (text.length > 0) {
                    setIsValidURL(validateURL(text))
                }
            } else {
                // Fallback for browsers without Clipboard API
                toast.error(
                    "Clipboard access not supported in your browser. Please paste manually."
                )

                // Focus the input field so user can paste manually
                document.getElementById("longURL").focus()
            }
        } catch (err) {
            console.error("Failed to read clipboard contents: ", err)
            toast.error(
                "Unable to paste from clipboard. Please paste manually."
            )
            // Focus the input field so user can paste manually
            document.getElementById("longURL").focus()
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
            <div className="custom-slug-toggle mt-3">
                <button
                    type="button"
                    className="text-sm flex items-center gap-1 text-primary-color hover:underline"
                    onClick={() => setShowCustomSlug(!showCustomSlug)}
                    style={{ color: "var(--primary-color)" }}
                >
                    {showCustomSlug ? (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Hide custom slug options
                        </>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Customize your short link
                        </>
                    )}
                </button>
            </div>

            {showCustomSlug && (
                <div className="custom-slug-input mt-3">
                    <label
                        htmlFor="customSlug"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Custom slug (optional)
                    </label>
                    <div className="flex items-center">
                        <span className="text-gray-500 mr-2">
                            {`${VITE_FRONTEND_DOMAIN}`}/
                        </span>
                        <div className="flex-grow">
                            <input
                                type="text"
                                id="customSlug"
                                name="customSlug"
                                placeholder="my-custom-link"
                                className={`url-input w-full ${
                                    !isValidSlug ? "border-red-500" : ""
                                }`}
                                value={customSlug}
                                onChange={handleSlugChange}
                                aria-invalid={!isValidSlug}
                                aria-describedby={
                                    !isValidSlug ? "slug-error" : undefined
                                }
                            />
                            {!isValidSlug && (
                                <p
                                    id="slug-error"
                                    className="text-red-500 text-sm mt-1"
                                >
                                    Only letters, numbers, hyphens, and
                                    underscores are allowed
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Create a memorable link that's easy to share (e.g.,
                        "my-event" or "product-launch")
                    </p>
                </div>
            )}

            <div className="mt-3 text-sm text-gray-500">
                <p>
                    Enter any long URL and get a shortened, easy-to-share link
                </p>
            </div>
        </form>
    )
}

export default URLForm
