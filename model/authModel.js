const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const LoginData = require("./loginModel");


const authSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            select:false
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        mobile: {
            type: Number,
            required: true,
            unique: true,
            select: false,
            min: [10, "Mobile must be 10 digit"]
        },
    },
    { timestamps: true }
)

authSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 8);
    next();
})

authSchema.methods.comparePassword = async function (EnterPass) {
    return bcrypt.compare(EnterPass, this.password);
}

authSchema.methods.generateJwt = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_KEY);
}

authSchema.methods.storeToken = async function (loginToken) {
    const findToken = await LoginData.findOne({ userId: this._id });

    if (!findToken) {
        return await LoginData.create({ userId: this._id, token: loginToken });
    } else {
        return await LoginData.findByIdAndUpdate(findToken._id, { token: loginToken })
    }
}

module.exports = mongoose.model("AuthModel", authSchema);