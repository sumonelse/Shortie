import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import NotFound from "./NotFound"

const RedirectToOriginalURL = () => {
    const [notFound, setNotFound] = useState(false)
    const { shortCode } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOriginalURL = async () => {
            try {
                const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN
                const response = await fetch(
                    `${backendDomain}/api/url/${shortCode}`
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
                setNotFound(true)
            }
        }

        fetchOriginalURL()
    }, [shortCode, navigate])

    return <div>{notFound ? <NotFound /> : <p>Redirecting...</p>}</div>
}

export default RedirectToOriginalURL
