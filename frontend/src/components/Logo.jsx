import React from "react"

const Logo = ({ size = "medium", color = "primary" }) => {
    // Define size classes
    const sizeClasses = {
        small: "w-8 h-8",
        medium: "w-12 h-12",
        large: "w-16 h-16",
        xlarge: "w-24 h-24",
    }

    // Define color classes with fallback values in case CSS variables aren't loaded
    const colorStyles = {
        primary: {
            main: "var(--primary-color, #4f46e5)",
            accent: "var(--primary-hover, #4338ca)",
        },
        white: { main: "#ffffff", accent: "#f3f4f6" },
        dark: { main: "#1f2937", accent: "#4b5563" },
    }

    const selectedSize = sizeClasses[size] || sizeClasses.medium
    const selectedColor = colorStyles[color] || colorStyles.primary

    return (
        <div
            className={`${selectedSize} flex items-center justify-center overflow-visible`}
        >
            <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                aria-label="Shortie URL Shortener Logo"
            >
                {/* Background circle */}
                <circle cx="50" cy="50" r="45" fill={selectedColor.main} />

                {/* Connected link design - top arc */}
                <path
                    d="M30,50 A20,20 0 0,1 50,30 A20,20 0 0,1 70,50"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Connected link design - bottom arc */}
                <path
                    d="M30,50 A20,20 0 0,0 50,70 A20,20 0 0,0 70,50"
                    stroke={selectedColor.accent}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Center dot */}
                <circle cx="50" cy="50" r="5" fill="white" />
            </svg>
        </div>
    )
}

export default Logo
