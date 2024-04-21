const asyncErrorhandle = require("../util/asyncErrorhandle");
const CustomerError = require("../util/CustomerError");
const AuthModel = require("../model/authModel")

const userLogin = asyncErrorhandle(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new CustomerError("check request body !", 422));
    }
    const findUser = await AuthModel.findOne({ email }).select({ password: 1 })
    if (!findUser) {
        return next(new CustomerError("user not found !", 404));
    }
    const isMatch = await findUser.comparePassword(password);
    if (!isMatch) {
        return next(new CustomerError("invalid credential !", 400));
    }
    const token = findUser.generateJwt();
    // const success = await findUser.storeToken(token);
    res.cookie('token', token, { httpOnly: false, secure: false }).status(200).json({ success: true, msg: "login successfull" })
})


const userRegister = asyncErrorhandle(async (req, res, next) => {
    const { mobile, password, email, name } = req.body
    if (!mobile || !password || !email || !name) {
        return next(new CustomerError("check request body !", 422));
    }
    const user = new AuthModel({ mobile, password, email, name });
    await user.save();
    res.status(201).json({ success: true, msg: "user register !" })
})


module.exports = { userLogin, userRegister };