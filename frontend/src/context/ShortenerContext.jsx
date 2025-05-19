import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react"

export const ShortenerContext = createContext({
    shortURL: "",
    setShortURL: () => {},
    urlHistory: [],
    addToHistory: () => {},
    clearHistory: () => {},
    isLoading: false,
    setIsLoading: () => {},
})

// Custom hook for localStorage with error handling
const useLocalStorage = (key, initialValue) => {
    // Initialize state with a function to avoid unnecessary calculations
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = useCallback(
        (value) => {
            try {
                // Allow value to be a function so we have the same API as useState
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value

                // Save state
                setStoredValue(valueToStore)

                // Save to localStorage
                localStorage.setItem(key, JSON.stringify(valueToStore))
            } catch (error) {
                console.error(`Error setting localStorage key "${key}":`, error)
            }
        },
        [key, storedValue]
    )

    return [storedValue, setValue]
}

export const ShortenerProvider = ({ children }) => {
    const [shortURL, setShortURL] = useState("")
    const [urlHistory, setUrlHistory] = useLocalStorage("url_history", [])
    const [isLoading, setIsLoading] = useState(false)

    // Memoize the addToHistory function to prevent unnecessary re-renders
    const addToHistory = useCallback(
        (originalUrl, shortUrl) => {
            const newEntry = {
                id: Date.now(),
                originalUrl,
                shortUrl,
                createdAt: new Date().toISOString(),
            }

            setUrlHistory((prevHistory) => {
                // Limit history to last 10 items
                return [newEntry, ...prevHistory].slice(0, 10)
            })
        },
        [setUrlHistory]
    )

    // Memoize the clearHistory function
    const clearHistory = useCallback(() => {
        setUrlHistory([])
    }, [setUrlHistory])

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            shortURL,
            setShortURL,
            urlHistory,
            addToHistory,
            clearHistory,
            isLoading,
            setIsLoading,
        }),
        [shortURL, urlHistory, addToHistory, clearHistory, isLoading]
    )

    return (
        <ShortenerContext.Provider value={contextValue}>
            {children}
        </ShortenerContext.Provider>
    )
}

// Custom hook for using the context with error handling
export const useShortenerContext = () => {
    const context = useContext(ShortenerContext)
    if (context === undefined) {
        throw new Error(
            "useShortenerContext must be used within a ShortenerProvider"
        )
    }
    return context
}
