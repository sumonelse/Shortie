const shortURL = (req, res, next) => {
    res.json({
        message: "Url Shorted successfully",
    })
}

export { shortURL }
