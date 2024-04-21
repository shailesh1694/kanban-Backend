const asyncErrorhandle = require("../util/asyncErrorhandle");
const bodyValidation = require("../util/bodyValidation");
const BoardModel = require("../model/boardModell");
const TaskModel = require('../model/taskModel');
const CustomerError = require("../util/CustomerError");
const AuthModel = require("../model/authModel")

const getAllBoard = asyncErrorhandle(async (req, res, next) => {
    const board = await BoardModel.find({}).populate("createBy");
    res.status(200).json({ success: true, data: board, msg: "all board" })
})

const createBoard = asyncErrorhandle(async (req, res, next) => {
    const { bgcolor, boardname } = req.body;
    console.log(boardname,"boardname")
    if (!boardname) {
        return next(new CustomerError("invalid request body !", 422))
    }
    const board = new BoardModel({ bgcolor, boardname, createBy: req.userId });
    await board.save();
    res.status(200).json({ success: true, msg: "board create" })
})

const updateBoard = asyncErrorhandle(async (req, res, next) => {
    const { bgcolor, boardId, boardname } = req.body;
    const reqBody = bodyValidation(req.body);
    const board = await BoardModel.findOneAndUpdate({ _id: boardId }, { ...reqBody }, { new: true });
    res.status(200).json({ success: true, board, msg: "board color updated" })
})

module.exports = { getAllBoard, createBoard, updateBoard };