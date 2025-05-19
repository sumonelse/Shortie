import React from "react"

const Logo = ({ size = "medium", color = "primary" }) => {
    // Define size classes
    const sizeClasses = {
        small: "w-8 h-8",
        medium: "w-12 h-12",
        large: "w-16 h-16",
        xlarge: "w-24 h-24",
    }

    // Define color classes
    const colorStyles = {
        primary: {
            main: "var(--primary-color)",
            accent: "var(--primary-hover)",
        },
        white: { main: "#ffffff", accent: "#f3f4f6" },
        dark: { main: "#1f2937", accent: "#4b5563" },
    }

    const selectedSize = sizeClasses[size] || sizeClasses.medium
    const selectedColor = colorStyles[color] || colorStyles.primary

    return (
        <div className={`${selectedSize} flex items-center justify-center`}>
            <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                {/* Background circle */}
                <circle cx="50" cy="50" r="45" fill={selectedColor.main} />

                {/* Chain link icon */}
                <path
                    d="M65,40 L60,35 C56.5,31.5 51,31.5 47.5,35 L42.5,40 C39,43.5 39,49 42.5,52.5 C43.5,53.5 44.5,54 46,54.5 L46,54.5 C45,53 44.5,51.5 44.5,49.5 C44.5,48 45,46.5 45.5,45.5 L50.5,40.5 C52,39 54.5,39 56,40.5 L61,45.5 C62.5,47 62.5,49.5 61,51 L58.5,53.5 C59.5,55.5 60,57.5 60,59.5 L65,54.5 C68.5,51 68.5,45.5 65,42 L65,40 Z"
                    fill={selectedColor.accent}
                />
                <path
                    d="M57.5,47.5 C56.5,46.5 55.5,46 54,45.5 L54,45.5 C55,47 55.5,48.5 55.5,50.5 C55.5,52 55,53.5 54.5,54.5 L49.5,59.5 C48,61 45.5,61 44,59.5 L39,54.5 C37.5,53 37.5,50.5 39,49 L41.5,46.5 C40.5,44.5 40,42.5 40,40.5 L35,45.5 C31.5,49 31.5,54.5 35,58 L40,63 C43.5,66.5 49,66.5 52.5,63 L57.5,58 C61,54.5 61,49 57.5,45.5 L57.5,47.5 Z"
                    fill="white"
                />

                {/* Letter S */}
                <text
                    x="50"
                    y="75"
                    fontSize="24"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="white"
                >
                    S
                </text>
            </svg>
        </div>
    )
}

export default Logo
