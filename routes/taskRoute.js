const router = require('express').Router();
const { getAllTask, createTask ,updateTask,updateTaskStatus} = require("../controller/taskController");
const tokenAuthorization = require("../middleware/tokenAuthorization");

router
    .get("/all_task", tokenAuthorization, getAllTask)
    .post("/create_task", tokenAuthorization, createTask)
    .put("/update_task", tokenAuthorization, updateTask)
    .put("/task_status_update", tokenAuthorization, updateTaskStatus)

module.exports = router;