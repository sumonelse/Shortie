import { createContext, useContext, useState, useEffect } from "react"

export const ShortenerContext = createContext({
    shortURL: "",
    setShortURL: () => {},
    urlHistory: [],
    addToHistory: () => {},
    clearHistory: () => {},
    isLoading: false,
    setIsLoading: () => {},
})

export const ShortenerProvider = ({ children }) => {
    const [shortURL, setShortURL] = useState("")
    const [urlHistory, setUrlHistory] = useState(() => {
        // Load history from localStorage if available
        const savedHistory = localStorage.getItem("url_history")
        return savedHistory ? JSON.parse(savedHistory) : []
    })
    const [isLoading, setIsLoading] = useState(false)

    // Save history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("url_history", JSON.stringify(urlHistory))
    }, [urlHistory])

    const addToHistory = (originalUrl, shortUrl) => {
        const newEntry = {
            id: Date.now(),
            originalUrl,
            shortUrl,
            createdAt: new Date().toISOString(),
        }

        setUrlHistory((prevHistory) => {
            // Limit history to last 10 items
            const updatedHistory = [newEntry, ...prevHistory].slice(0, 10)
            return updatedHistory
        })
    }

    const clearHistory = () => {
        setUrlHistory([])
        localStorage.removeItem("url_history")
    }

    return (
        <ShortenerContext.Provider
            value={{
                shortURL,
                setShortURL,
                urlHistory,
                addToHistory,
                clearHistory,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </ShortenerContext.Provider>
    )
}

export const useShortenerContext = () => {
    return useContext(ShortenerContext)
}
