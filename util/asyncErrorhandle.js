module.exports = (callBack) => (req, res, next) => callBack(req, res, next).catch((error) => next(error))

