const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/user.controller");

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
// router.post("/events", authMiddleware, eventController.events);
// router.get("/events", authMiddleware, eventController.fetchAllEvents);
// router.put("/events/:id", authMiddleware, eventController.updateEvent);
// router.put("/events/:id", authMiddleware, eventController.deleteEvent);

module.exports = userRouter;
