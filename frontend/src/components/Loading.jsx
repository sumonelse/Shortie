import React from "react"
import "../stylesheets/Loading.css"

const Loading = () => {
    return (
        <div className="loading-container">
            <span className="loader"></span>
            <p className="loading-text">Shortening your URL...</p>
        </div>
    )
}

export default Loading
