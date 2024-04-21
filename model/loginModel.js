const mongoose = require("mongoose");

const loginDataSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
    }
}, { timestamps: true })


module.exports = mongoose.model("LoginData", loginDataSchema)