import React, { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./stylesheets/App.css"
import Loading from "./components/Loading"

// Lazy load components for code splitting
const URLShortener = lazy(() => import("./components/URLShortener"))
const RedirectToOriginalURL = lazy(() =>
    import("./components/RedirectToOriginalURL")
)
const NotFound = lazy(() => import("./components/NotFound"))

// Error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error("React Error Boundary caught an error:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    Something went wrong. Please refresh the page.
                </div>
            )
        }
        return this.props.children
    }
}

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <ErrorBoundary>
                    <Suspense fallback={<Loading />}>
                        <URLShortener />
                    </Suspense>
                </ErrorBoundary>
            ),
            errorElement: (
                <Suspense fallback={<Loading />}>
                    <NotFound />
                </Suspense>
            ),
        },
        {
            path: "/:shortCode",
            element: (
                <ErrorBoundary>
                    <Suspense fallback={<Loading />}>
                        <RedirectToOriginalURL />
                    </Suspense>
                </ErrorBoundary>
            ),
        },
    ])

    return <RouterProvider router={router} />
}

export default App
