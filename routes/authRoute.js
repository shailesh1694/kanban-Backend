const router = require('express').Router();
const {userRegister,userLogin} = require("../controller/authController")

router
.post("/login",userLogin)
.post("/register",userRegister)

module.exports = router;