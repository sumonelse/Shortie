import createHttpError from "http-errors"

/**
 * Middleware to validate URL shortening requests
 */
export const validateUrlRequest = (req, res, next) => {
    const { longURL, customSlug } = req.body

    // Check if longURL is provided
    if (!longURL) {
        return next(createHttpError(400, "Please provide a URL to shorten"))
    }

    // Basic URL format validation
    try {
        new URL(longURL)
    } catch (error) {
        return next(createHttpError(400, "Please provide a valid URL format"))
    }

    // Validate custom slug if provided
    if (customSlug) {
        // Check slug length
        if (customSlug.length < 3 || customSlug.length > 20) {
            return next(
                createHttpError(
                    400,
                    "Custom slug must be between 3 and 20 characters"
                )
            )
        }

        // Check slug format (only letters, numbers, hyphens, and underscores)
        const slugPattern = /^[a-zA-Z0-9_-]+$/
        if (!slugPattern.test(customSlug)) {
            return next(
                createHttpError(
                    400,
                    "Custom slug can only contain letters, numbers, hyphens, and underscores"
                )
            )
        }
    }

    // If all validations pass, proceed to the controller
    next()
}
