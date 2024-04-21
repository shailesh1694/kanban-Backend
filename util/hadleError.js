module.exports = (error, req, res, next) => {

    res.status(error.statusCode || 500).json({
        success: false,
        stack: error.statck,
        msg: error.message,
        error: error
    })

}