import React, { useRef, useState } from "react"
import "../stylesheets/Shortener.css"
import URLForm from "./URLForm"
import Loading from "./Loading"
import { useShortenerContext } from "../context/ShortenerContext"
import toast from "react-hot-toast"

const Shortener = () => {
    const [loading, setLoading] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const { shortURL, urlHistory, clearHistory } = useShortenerContext()
    const urlRef = useRef(null)

    const copyToClipboard = (textToCopy) => {
        if (urlRef.current && textToCopy === shortURL) {
            urlRef.current.select()
        }
        window.navigator.clipboard.writeText(textToCopy)
        toast.success("URL copied to clipboard!", {
            icon: "📋",
            style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
            },
        })
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return (
            date.toLocaleDateString() +
            " " +
            date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        )
    }

    const truncateUrl = (url, maxLength = 40) => {
        return url.length > maxLength
            ? url.substring(0, maxLength) + "..."
            : url
    }

    return (
        <div className="shortener-wrapper flex flex-col shadow main-br">
            <div className="intro">
                <h1>Short your LOOONG URL</h1>
                <p className="sub">
                    Free, fast, and secure URL shortening service
                </p>
            </div>

            <URLForm setLoading={setLoading} />

            {loading && <Loading />}

            {shortURL.length > 0 && (
                <div className="result-container">
                    <p className="mb-2 font-medium text-gray-700">
                        Your shortened URL:
                    </p>
                    <div className="flex gap-2 w-full flex-col md:flex-row">
                        <input
                            type="text"
                            value={shortURL}
                            readOnly
                            className="url-input flex-grow"
                            ref={urlRef}
                            onClick={(e) => e.target.select()}
                        />
                        <button
                            className="btn copy-btn"
                            onClick={() => copyToClipboard(shortURL)}
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
                            Copy
                        </button>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <p>
                            Share this link with anyone who needs access to your
                            original URL
                        </p>
                    </div>
                </div>
            )}

            {urlHistory.length > 0 && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <button
                            className="text-primary-color font-medium flex items-center gap-1"
                            onClick={() => setShowHistory(!showHistory)}
                            style={{ color: "var(--primary-color)" }}
                        >
                            {showHistory ? (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Hide History
                                </>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Show History ({urlHistory.length})
                                </>
                            )}
                        </button>

                        {showHistory && (
                            <button
                                className="text-red-500 text-sm flex items-center gap-1"
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Are you sure you want to clear your URL history?"
                                        )
                                    ) {
                                        clearHistory()
                                        toast.success("History cleared")
                                    }
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Clear
                            </button>
                        )}
                    </div>

                    {showHistory && (
                        <div className="history-list bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto">
                            {urlHistory.map((item) => (
                                <div
                                    key={item.id}
                                    className="history-item p-2 border-b border-gray-200 last:border-0"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="text-sm font-medium text-gray-800 break-all">
                                            {truncateUrl(item.originalUrl)}
                                        </div>
                                        <div className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                            {formatDate(item.createdAt)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="text-primary-color text-sm break-all flex-grow"
                                            style={{
                                                color: "var(--primary-color)",
                                            }}
                                        >
                                            {item.shortUrl}
                                        </div>
                                        <button
                                            className="text-gray-600 hover:text-primary-color p-1"
                                            onClick={() =>
                                                copyToClipboard(item.shortUrl)
                                            }
                                            title="Copy to clipboard"
                                            style={{
                                                color: "var(--primary-color)",
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                    © {new Date().getFullYear()} URL Shortener. All rights
                    reserved.
                </p>
            </div>
        </div>
    )
}

export default Shortener
