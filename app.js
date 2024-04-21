const express = require("express");
const app = express();
const helmet = require("helmet");
const dbConnection = require("./config/dbConnection");
const BoardModel = require("./model/boardModell");
const TaskModel = require('./model/taskModel');
const cookieParser = require('cookie-parser')
const dotEnv = require("dotenv");
const handleError = require("./util/hadleError");
const morgan = require("morgan");
const cors = require("cors")
dotEnv.config({ path: `./config/${process.env.NODE_ENV}.env` })

// db
dbConnection(process.env.DB_URL);

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(function (req, res, next) {

    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173")
    res.setHeader("Access-Control-Allow-Methods", "*")
    // res.setHeader("Access-Control-Allow-Headers", "GET,POST,PATCH,PUT,DELETE,OPTIONS")
    // res.setHeader("Access-Control-Allow-Credentials", true)
    next()  
})
app.use(morgan("dev"))

app.use("/api/v1", require("./routes/authRoute"));
app.use("/api/v1", require("./routes/boardRoute"));
app.use("/api/v1", require("./routes/taskRoute"));

// app.post("/create-board", async (req, res) => {

//     const { bgcolor, boardname } = req.body;
//     try {
//         const board = new BoardModel({ bgcolor, boardname });
//         await board.save();
//         res.status(200).json({ success: true, msg: "board create" })
//     } catch (error) {
//         res.status(500).json({ success: false, error })
//     }
// })

// app.get("/all_board", async (req, res) => {
//         const board = await BoardModel.find({});
//         res.status(200).json({ success: true, data: board, msg: "all board" })

// })

// app.patch("/update-board", async (req, res) => {
//     const { bgcolor, boardname } = req.body
//     try {
//         const board = await BoardModel.findOneAndUpdate({ boardname: boardname }, { $set: { bgcolor: bgcolor } }, { new: true });
//         res.status(200).json({ success: true, board, msg: "board color updated" })
//     } catch (error) {
//         res.status(500).json({ success: false, error })
//     }
// })

// app.post("/create_task", async (req, res) => {

//     try {
//         const task = new TaskModel({ ...req.body })
//         await task.save();
//         res.status(200).json({ success: true, msg: "Task created" })
//     } catch (error) {
//         res.status(500).json({ success: false, error })
//     }
// })

// app.get("/all_task", async (req, res) => {
//     try {
//         const alltask = await TaskModel.find({});
//         res.status(200).json({ success: true, data: alltask, msg: "get all task" })
//     } catch (error) {
//         res.status(500).json({ success: false, error })
//     }
// })

// app.patch("/task_status_update", async (req, res) => {
//     const { taskId, newStatus } = req.body
//     try {
//         const alltask = await TaskModel.findOneAndUpdate({ _id: taskId }, { taskStatus: newStatus });
//         res.status(200).json({ success: true, msg: "task status updated" })
//     } catch (error) {
//         res.status(500).json({ success: false, error })
//     }
// })

// app.put("/task_update", async (req, res) => {
//     const { title, taskStatus, tag, description, deadline, assign_to, taskColor, taskId } = req.body
//     try {
//         const alltask = await TaskModel.findOneAndUpdate({ _id: taskId }, { $set: { taskStatus, title, taskStatus, tag, description, deadline, assign_to, taskColor } });
//         res.status(200).json({ success: true, msg: "task  updated" })
//     } catch (error) {
//         res.status(500).json({ success: false, error })
//     }
// })

app.use(handleError);

app.listen(process.env.PORT, () => {
    console.log(`server start at port 8080 ` + process.env.PORT)
})