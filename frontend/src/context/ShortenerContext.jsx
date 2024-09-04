import { createContext, useContext, useState } from "react"

export const ShortenerContext = createContext("")

export const ShortenerProvider = ({ children }) => {
    const [shortURL, setShortURL] = useState("")

    return (
        <ShortenerContext.Provider value={{ shortURL, setShortURL }}>
            {children}
        </ShortenerContext.Provider>
    )
}

export const useShortenerContext = () => {
    return useContext(ShortenerContext)
}
