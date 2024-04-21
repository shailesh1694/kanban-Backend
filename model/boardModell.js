const mongoose = require("mongoose");

const boardSchema = mongoose.Schema(
    {
        boardname: {
            type: String,
            required: [true, "board name is mandatory !"],
            unique: true
        },
        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"AuthModel"
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        bgcolor: { type: String }
    }, { timestamps: true });

module.exports = mongoose.model("Board", boardSchema)