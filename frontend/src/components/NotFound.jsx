import React from "react"
import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <div className="h-screen w-screen flex flex-col gap-3 items-center justify-center">
            <div className="text-center">
                <h2 className="text-5xl font-bold">404</h2>
                <div className="">URL doesn't Exist</div>
            </div>
            <Link to={"/"} className="btn">
                Go to HomePage
            </Link>
        </div>
    )
}

export default NotFound
