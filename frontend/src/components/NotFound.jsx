import React from "react"
import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <div className="h-screen w-screen flex flex-col gap-5 items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2
                    className="text-7xl font-bold text-primary-color mb-2"
                    style={{ color: "var(--primary-color)" }}
                >
                    404
                </h2>
                <div className="text-xl mb-4">Oops! This URL doesn't exist</div>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                    The link you're looking for may have been removed, renamed,
                    or is temporarily unavailable.
                </p>
            </div>
            <Link to={"/"} className="btn flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                    />
                </svg>
                Back to Homepage
            </Link>
        </div>
    )
}

export default NotFound
