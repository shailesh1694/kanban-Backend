const asyncErrorhandle = require("../util/asyncErrorhandle");
const bodyValidation = require("../util/bodyValidation");
const BoardModel = require("../model/boardModell");
const TaskModel = require('../model/taskModel');
const CustomerError = require("../util/CustomerError");
const AuthModel = require("../model/authModel")

const getAllTask = asyncErrorhandle(async (req, res, next) => {
    const alltask = await TaskModel.find({}).populate("createBy");
    res.status(200).json({ success: true, data: alltask, msg: "get all task" })
})

const createTask = asyncErrorhandle(async (req, res, next) => {
    const { title, taskStatus, tag, description, deadline, assign_to, taskColor, taskId, createBy } = req.body
    if (req?.body?.taskStatus === "" || req?.body?.title === "") {
        return next(new CustomerError("task status and title must be !", 422))
    }
    const task = new TaskModel({ ...req.body, createBy: req.userId })
    await task.save();
    res.status(200).json({ success: true, msg: "Task created" })
})

const updateTask = asyncErrorhandle(async (req, res, next) => {
    const { title, taskStatus, tag, description, deadline, assign_to, taskColor, taskId } = req.body
    await TaskModel.findOneAndUpdate({ _id: taskId }, { taskStatus, title, taskStatus, tag, description, deadline, assign_to, taskColor });
    res.status(200).json({ success: true, msg: "task  updated" })
})


const updateTaskStatus = asyncErrorhandle(async (req, res, next) => {
    const { taskId, newStatus } = req.body
    const alltask = await TaskModel.findOneAndUpdate({ _id: taskId }, { taskStatus: newStatus });
    res.status(200).json({ success: true, msg: "task status updated" })
})

module.exports = { getAllTask, createTask, updateTask, updateTaskStatus };