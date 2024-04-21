const asyncErrorhandle = require("../util/asyncErrorhandle");
const CustomerError = require("../util/CustomerError");
const jwt = require("jsonwebtoken");

const tokenAuthorization = async (req, res, next) => {
    // console.log(req?.headers?.authorization,"header")

    if (!req?.headers?.authorization) {
        return next(new CustomerError("invalid token ! login again", 400))
    }

    jwt.verify(req?.headers?.authorization, process.env.SECRET_KEY,
        function (error, decodeId) {
            if (error) {
                return next(new CustomerError("invalid token ! login again", 403))
            }
            req.userId = decodeId?.id
        })
    next();
}

module.exports = tokenAuthorization;