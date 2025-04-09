const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/user.controller");

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);

module.exports = userRouter;
