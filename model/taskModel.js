const mongoose = require("mongoose");


const taskSchema = mongoose.Schema({
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "AuthModel"
    },
    title: {
        type: String,
        required: [true, "provide task title !"],
    },
    tag: {
        type: Array,
        default: []
    },
    description: {
        type: String,
        default: ""
    },
    deadline: {
        type: Date,
        default:""
    },
    taskStatus: {
        type: String,
        required: [true, "provide task status"]
    },
    assign_to: {
        type: Array,
        default: []
    },
    taskColor: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);