import React, { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

const RedirectToOriginalURL = () => {
    const { shortCode } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOriginalURL = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/url/${shortCode}`
                )

                if (!response.ok) {
                    throw new Error("URL not found")
                }

                const data = await response.json()
                const originalURL = data.originalURL

                // Redirect to the original URL
                window.location.href = originalURL
            } catch (error) {
                console.error("Error fetching original URL:", error)
                // Handle the error (e.g., show a 404 page)
                navigate("/404") // Navigate to a 404 page if URL not found
            }
        }

        fetchOriginalURL()
    }, [shortCode, navigate])

    return (
        <div>
            <p>Redirecting...</p>
        </div>
    )
}

export default RedirectToOriginalURL
