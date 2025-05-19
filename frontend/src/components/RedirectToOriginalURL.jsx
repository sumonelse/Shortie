import React, { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import NotFound from "./NotFound"
import "../stylesheets/Redirect.css"

const RedirectToOriginalURL = () => {
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(true)
    const [originalURL, setOriginalURL] = useState("")
    const [countdown, setCountdown] = useState(5)
    const [progress, setProgress] = useState(0)
    const [redirectCancelled, setRedirectCancelled] = useState(false)
    const countdownIntervalRef = useRef(null)
    const { shortCode } = useParams()
    const navigate = useNavigate()

    // Function to clear the countdown interval
    const clearCountdownInterval = () => {
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current)
            countdownIntervalRef.current = null
        }
    }

    useEffect(() => {
        const fetchOriginalURL = async () => {
            try {
                setLoading(true)
                const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN
                const response = await fetch(
                    `${backendDomain}/api/url/${shortCode}`
                )

                if (!response.ok) {
                    // Parse the error response to get the detailed message
                    const errorData = await response.json()
                    throw new Error(errorData.message || "URL not found")
                }

                const data = await response.json()
                const fetchedURL = data.originalURL

                // Set the original URL and start countdown
                setOriginalURL(fetchedURL)
                setLoading(false)

                // Only start countdown if redirect hasn't been cancelled
                if (!redirectCancelled) {
                    // Start countdown for automatic redirect
                    let timer = countdown
                    countdownIntervalRef.current = setInterval(() => {
                        if (redirectCancelled) {
                            clearCountdownInterval()
                            return
                        }

                        timer -= 1
                        setCountdown(timer)
                        setProgress(((5 - timer) / 5) * 100)

                        if (timer <= 0) {
                            clearCountdownInterval()
                            window.location.href = fetchedURL
                        }
                    }, 1000)
                }
            } catch (error) {
                console.error("Error fetching original URL:", error)
                setLoading(false)
                setNotFound(true)
            }
        }

        fetchOriginalURL()

        // Cleanup function to clear interval when component unmounts
        return () => {
            clearCountdownInterval()
        }
    }, [shortCode, navigate, redirectCancelled])

    const handleRedirectNow = () => {
        if (originalURL) {
            // Clear the interval before redirecting
            clearCountdownInterval()
            window.location.href = originalURL
        }
    }

    const handleCancel = () => {
        // Set redirect cancelled flag and clear the interval
        setRedirectCancelled(true)
        clearCountdownInterval()
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
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                    >
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="var(--primary-color)"
                        />

                        {/* Chain link icon */}
                        <path
                            d="M65,40 L60,35 C56.5,31.5 51,31.5 47.5,35 L42.5,40 C39,43.5 39,49 42.5,52.5 C43.5,53.5 44.5,54 46,54.5 L46,54.5 C45,53 44.5,51.5 44.5,49.5 C44.5,48 45,46.5 45.5,45.5 L50.5,40.5 C52,39 54.5,39 56,40.5 L61,45.5 C62.5,47 62.5,49.5 61,51 L58.5,53.5 C59.5,55.5 60,57.5 60,59.5 L65,54.5 C68.5,51 68.5,45.5 65,42 L65,40 Z"
                            fill="var(--primary-hover)"
                        />
                        <path
                            d="M57.5,47.5 C56.5,46.5 55.5,46 54,45.5 L54,45.5 C55,47 55.5,48.5 55.5,50.5 C55.5,52 55,53.5 54.5,54.5 L49.5,59.5 C48,61 45.5,61 44,59.5 L39,54.5 C37.5,53 37.5,50.5 39,49 L41.5,46.5 C40.5,44.5 40,42.5 40,40.5 L35,45.5 C31.5,49 31.5,54.5 35,58 L40,63 C43.5,66.5 49,66.5 52.5,63 L57.5,58 C61,54.5 61,49 57.5,45.5 L57.5,47.5 Z"
                            fill="white"
                        />

                        {/* Letter S */}
                        <text
                            x="50"
                            y="75"
                            fontSize="24"
                            fontWeight="bold"
                            textAnchor="middle"
                            fill="white"
                        >
                            S
                        </text>
                    </svg>
                </div>

                <h1 className="redirect-title">Shortie is redirecting you</h1>

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
                            Shortie
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
                        © {new Date().getFullYear()} Shortie. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RedirectToOriginalURL
