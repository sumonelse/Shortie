import React, { useRef, useState } from "react"
import "../stylesheets/Shortener.css"
import "../stylesheets/QRCode.css"
import URLForm from "./URLForm"
import Loading from "./Loading"
import QRCodeGenerator from "./QRCodeGenerator"
import { useShortenerContext } from "../context/ShortenerContext"
import toast from "react-hot-toast"

const Shortener = () => {
    const [loading, setLoading] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const { shortURL, urlHistory, clearHistory } = useShortenerContext()
    const urlRef = useRef(null)

    const copyToClipboard = (textToCopy) => {
        try {
            if (urlRef.current && textToCopy === shortURL) {
                urlRef.current.select()
            }

            // Check if Clipboard API is available
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard
                    .writeText(textToCopy)
                    .then(() => {
                        toast.success("URL copied to clipboard!", {
                            icon: "📋",
                            style: {
                                borderRadius: "10px",
                                background: "#333",
                                color: "#fff",
                            },
                        })
                    })
                    .catch((err) => {
                        console.error("Failed to copy: ", err)
                        fallbackCopyToClipboard(textToCopy)
                    })
            } else {
                // Fallback for browsers without Clipboard API
                fallbackCopyToClipboard(textToCopy)
            }
        } catch (err) {
            console.error("Copy failed: ", err)
            toast.error("Failed to copy URL. Please select and copy manually.")
        }
    }

    // Fallback copy method using document.execCommand
    const fallbackCopyToClipboard = (text) => {
        try {
            // Create a temporary textarea element
            const textArea = document.createElement("textarea")
            textArea.value = text

            // Make the textarea out of viewport
            textArea.style.position = "fixed"
            textArea.style.left = "-999999px"
            textArea.style.top = "-999999px"
            document.body.appendChild(textArea)

            // Select and copy
            textArea.focus()
            textArea.select()
            const successful = document.execCommand("copy")

            // Clean up
            document.body.removeChild(textArea)

            if (successful) {
                toast.success("URL copied to clipboard!", {
                    icon: "📋",
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                })
            } else {
                toast.error(
                    "Failed to copy URL. Please select and copy manually."
                )
            }
        } catch (err) {
            console.error("Fallback copy failed: ", err)
            toast.error("Failed to copy URL. Please select and copy manually.")
        }
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
                <h1>
                    Short your <span className="text-gradient">LOOONG URL</span>
                </h1>
                <p className="sub">
                    Free, fast, and secure URL shortening with Shortie
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
                    {/* QR Code Generator */}
                    <QRCodeGenerator url={shortURL} />

                    <div className="mt-4 text-sm text-gray-500">
                        <p>
                            Share this link with anyone who needs access to your
                            original URL
                        </p>
                    </div>

                    <div className="share-buttons mt-3">
                        <div className="flex flex-wrap gap-2 justify-center">
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                    shortURL
                                )}&text=Check out this link I shortened with Shortie:`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-button twitter"
                                title="Share on Twitter"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                                </svg>
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                    shortURL
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-button facebook"
                                title="Share on Facebook"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                </svg>
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                    shortURL
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-button linkedin"
                                title="Share on LinkedIn"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                                </svg>
                            </a>
                            <a
                                href={`mailto:?subject=Check out this link&body=I shortened this link with Shortie: ${shortURL}`}
                                className="share-button email"
                                title="Share via Email"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                                </svg>
                            </a>
                            <a
                                href={`https://api.whatsapp.com/send?text=Check out this link I shortened with Shortie: ${encodeURIComponent(
                                    shortURL
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-button whatsapp"
                                title="Share on WhatsApp"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                                </svg>
                            </a>
                        </div>
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
                    © {new Date().getFullYear()} Shortie. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default Shortener
