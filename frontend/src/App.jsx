import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import URLShortener from "./components/URLShortener"
import "./stylesheets/App.css"
import RedirectToOriginalURL from "./components/RedirectToOriginalURL"

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <URLShortener />,
        },
        {
            path: "/:shortCode",
            element: <RedirectToOriginalURL />,
        },
    ])
    return <RouterProvider router={router} />
}

export default App
