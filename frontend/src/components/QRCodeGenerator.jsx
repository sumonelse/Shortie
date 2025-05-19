import React, { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import toast from "react-hot-toast"

const QRCodeGenerator = ({ url }) => {
    const [showQR, setShowQR] = useState(false)
    const [qrSize, setQrSize] = useState(128)

    const downloadQRCode = () => {
        try {
            // QRCodeSVG doesn't directly provide a canvas element, so we need to create one
            const svgElement = document.getElementById("qr-code-svg")
            if (!svgElement) {
                toast.error("QR Code element not found. Please try again.")
                return
            }

            // Create a canvas element
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            if (!ctx) {
                toast.error("Canvas context not available in your browser.")
                return
            }

            // Set canvas dimensions to match the QR code size
            canvas.width = qrSize
            canvas.height = qrSize

            // Create an image from the SVG
            const img = new Image()
            const svgData = new XMLSerializer().serializeToString(svgElement)
            const svgBlob = new Blob([svgData], {
                type: "image/svg+xml;charset=utf-8",
            })
            const blobUrl = URL.createObjectURL(svgBlob)

            // Handle errors
            img.onerror = () => {
                URL.revokeObjectURL(blobUrl)
                toast.error(
                    "Failed to generate QR code image. Please try again."
                )
            }

            img.onload = () => {
                try {
                    // Draw the image on the canvas
                    ctx.fillStyle = "#FFFFFF"
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                    // Try to get data URL (may fail in some browsers due to security restrictions)
                    let dataUrl
                    try {
                        dataUrl = canvas.toDataURL("image/png")
                    } catch (securityError) {
                        console.error("Canvas security error:", securityError)
                        toast.error(
                            "Cannot download QR code due to browser security restrictions."
                        )
                        URL.revokeObjectURL(blobUrl)
                        return
                    }

                    // Create a temporary link element
                    const link = document.createElement("a")
                    link.href = dataUrl
                    link.download = "shortie-qrcode.png"
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)

                    // Clean up
                    URL.revokeObjectURL(blobUrl)

                    toast.success("QR Code downloaded successfully!", {
                        icon: "📥",
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff",
                        },
                    })
                } catch (drawError) {
                    console.error("Error drawing QR code:", drawError)
                    toast.error("Failed to generate QR code. Please try again.")
                    URL.revokeObjectURL(blobUrl)
                }
            }

            img.src = blobUrl
        } catch (error) {
            console.error("QR code download error:", error)
            toast.error("Failed to download QR code. Please try again.")
        }
    }

    if (!url) return null

    return (
        <div className="qr-code-container">
            {!showQR ? (
                <button
                    className="qr-toggle-btn"
                    onClick={() => setShowQR(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1zM13 12a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3zm1 2v1h1v-1h-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Generate QR Code
                </button>
            ) : (
                <div className="qr-code-wrapper">
                    <div className="qr-code-header">
                        <h3>QR Code for your shortened URL</h3>
                        <button
                            className="qr-close-btn"
                            onClick={() => setShowQR(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="qr-code-display">
                        <QRCodeSVG
                            id="qr-code-svg"
                            value={url}
                            size={qrSize}
                            bgColor={"#ffffff"}
                            fgColor={"var(--primary-color)"}
                            level={"H"}
                            includeMargin={true}
                        />
                    </div>

                    <div className="qr-code-controls">
                        <div className="qr-size-control">
                            <label htmlFor="qr-size">Size:</label>
                            <input
                                type="range"
                                id="qr-size"
                                min="128"
                                max="256"
                                step="16"
                                value={qrSize}
                                onChange={(e) =>
                                    setQrSize(Number(e.target.value))
                                }
                            />
                        </div>

                        <button
                            className="qr-download-btn"
                            onClick={downloadQRCode}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Download QR Code
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QRCodeGenerator
