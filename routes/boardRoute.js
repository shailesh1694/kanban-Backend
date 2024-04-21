const router = require('express').Router();
const { getAllBoard, createBoard ,updateBoard} = require("../controller/boardController");
const tokenAuthorization = require("../middleware/tokenAuthorization");

router
    .get("/all_board", tokenAuthorization, getAllBoard)
    .post("/create_board", tokenAuthorization, createBoard)
    .patch("/update_board", tokenAuthorization, updateBoard)

module.exports = router;