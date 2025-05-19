import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const isProduction = mode === "production"

    return {
        plugins: [
            react(),
            // Add visualizer in production mode to analyze bundle size
            isProduction &&
                visualizer({
                    open: false,
                    gzipSize: true,
                    brotliSize: true,
                    filename: "dist/stats.html",
                }),
        ],
        build: {
            // Optimize build settings
            target: "es2015",
            minify: "terser",
            terserOptions: {
                compress: {
                    drop_console: isProduction,
                    drop_debugger: isProduction,
                },
            },
            // Split chunks for better caching
            rollupOptions: {
                output: {
                    manualChunks: {
                        // Split vendor code into separate chunks
                        "vendor-react": [
                            "react",
                            "react-dom",
                            "react-router-dom",
                        ],
                        "vendor-ui": ["react-hot-toast", "qrcode.react"],
                    },
                },
            },
            // Generate source maps in development only
            sourcemap: !isProduction,
            // Reduce chunk size warnings threshold
            chunkSizeWarningLimit: 1000,
        },
        // Optimize dev server
        server: {
            hmr: true,
            // Optimize HMR for faster updates
            watch: {
                usePolling: false,
            },
        },
    }
})
