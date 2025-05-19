import { config } from "./config.js"

/**
 * Helmet configuration for enhanced security
 * @see https://helmetjs.github.io/
 */
export const helmetConfig = {
    // Content Security Policy
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
            ],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", config.frontendDomain],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },

    // HTTP Strict Transport Security
    hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
    },

    // X-Frame-Options
    frameguard: {
        action: "deny", // DENY - prevent framing completely
    },

    // X-Content-Type-Options
    noSniff: true,

    // X-XSS-Protection
    xssFilter: true,

    // Hide X-Powered-By header
    hidePoweredBy: true,

    // X-DNS-Prefetch-Control
    dnsPrefetchControl: {
        allow: false,
    },

    // Cache control
    noCache: {
        enable: config.env === "production" ? false : true, // Enable caching in production
    },

    // Referrer-Policy
    referrerPolicy: {
        policy: "same-origin",
    },

    // Permissions Policy (formerly Feature-Policy)
    permittedCrossDomainPolicies: {
        permittedPolicies: "none",
    },

    // Cross-Origin-Embedder-Policy
    crossOriginEmbedderPolicy: false,

    // Cross-Origin-Opener-Policy
    crossOriginOpenerPolicy: {
        policy: "same-origin",
    },

    // Cross-Origin-Resource-Policy
    crossOriginResourcePolicy: {
        policy: "same-origin",
    },

    // Origin-Agent-Cluster
    originAgentCluster: true,
}

export default helmetConfig
