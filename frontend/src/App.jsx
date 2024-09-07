import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import URLShortener from "./components/URLShortener"
import "./stylesheets/App.css"
import RedirectToOriginalURL from "./components/RedirectToOriginalURL"
import NotFound from "./components/NotFound"

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <URLShortener />,
            errorElement: <NotFound />,
        },
        {
            path: "/:shortCode",
            element: <RedirectToOriginalURL />,
        },
    ])
    return <RouterProvider router={router} />
}

export default App
