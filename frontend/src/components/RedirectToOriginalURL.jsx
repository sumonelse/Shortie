import React, { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import NotFound from "./NotFound"
import "../stylesheets/Redirect.css"

const RedirectToOriginalURL = () => {
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(true)
    const [originalURL, setOriginalURL] = useState("")
    const [countdown, setCountdown] = useState(5)
    const [progress, setProgress] = useState(0)
    const { shortCode } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOriginalURL = async () => {
            try {
                setLoading(true)
                const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN
                const response = await fetch(
                    `${backendDomain}/api/url/${shortCode}`
                )

                if (!response.ok) {
                    throw new Error("URL not found")
                }

                const data = await response.json()
                const fetchedURL = data.originalURL

                // Set the original URL and start countdown
                setOriginalURL(fetchedURL)
                setLoading(false)

                // Start countdown for automatic redirect
                let timer = countdown
                const countdownInterval = setInterval(() => {
                    timer -= 1
                    setCountdown(timer)
                    setProgress(((5 - timer) / 5) * 100)

                    if (timer <= 0) {
                        clearInterval(countdownInterval)
                        window.location.href = fetchedURL
                    }
                }, 1000)

                return () => clearInterval(countdownInterval)
            } catch (error) {
                console.error("Error fetching original URL:", error)
                setLoading(false)
                setNotFound(true)
            }
        }

        fetchOriginalURL()
    }, [shortCode, navigate])

    const handleRedirectNow = () => {
        if (originalURL) {
            window.location.href = originalURL
        }
    }

    const handleCancel = () => {
        navigate("/")
    }

    // Format URL for display (truncate if too long)
    const formatURL = (url) => {
        if (!url) return ""

        try {
            const urlObj = new URL(url)
            const domain = urlObj.hostname
            const path = urlObj.pathname + urlObj.search

            // Bold the domain part
            return (
                <span>
                    <span className="font-medium">{domain}</span>
                    {path.length > 30 ? path.substring(0, 27) + "..." : path}
                </span>
            )
        } catch (e) {
            // Fallback if URL parsing fails
            if (url.length > 50) {
                return url.substring(0, 47) + "..."
            }
            return url
        }
    }

    // Determine if URL seems safe (basic check)
    const isSafeURL = (url) => {
        if (!url) return true

        // List of potentially suspicious terms
        const suspiciousTerms = [
            "phishing",
            "malware",
            "virus",
            "hack",
            "scam",
            "free-money",
        ]

        return !suspiciousTerms.some((term) => url.toLowerCase().includes(term))
    }

    if (notFound) {
        return <NotFound />
    }

    return (
        <div className="redirect-container">
            <div className="redirect-card">
                <div className="redirect-logo">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18v2H3v-2zm10-8l6 6H7l6-6z" />
                    </svg>
                </div>

                <h1 className="redirect-title">Redirecting you shortly</h1>

                {loading ? (
                    <div className="flex items-center justify-center my-6">
                        <div className="redirect-spinner"></div>
                        <p>Loading destination...</p>
                    </div>
                ) : (
                    <>
                        <p className="redirect-message">
                            You are being redirected to the following URL:
                        </p>

                        <div className="redirect-url" title={originalURL}>
                            {formatURL(originalURL)}
                        </div>

                        {!isSafeURL(originalURL) && (
                            <div className="redirect-warning">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>
                                    This URL may be unsafe. Proceed with
                                    caution.
                                </span>
                            </div>
                        )}

                        <div className="redirect-progress">
                            <div
                                className="redirect-progress-bar"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <p className="redirect-countdown">
                            Redirecting in {countdown} seconds...
                        </p>

                        <div className="redirect-security-info">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>URL verified by URL Shortener</span>
                        </div>

                        <div className="redirect-actions">
                            <button
                                className="redirect-btn redirect-btn-primary"
                                onClick={handleRedirectNow}
                            >
                                Redirect Now
                            </button>

                            <button
                                className="redirect-btn redirect-btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}

                <div className="mt-6 text-xs text-gray-500 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            to="/"
                            className="text-primary-color hover:underline"
                            style={{ color: "var(--primary-color)" }}
                        >
                            URL Shortener
                        </Link>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Safe browsing enabled
                        </span>
                    </div>
                    <p>
                        © {new Date().getFullYear()} URL Shortener. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RedirectToOriginalURL
