const express = require("express");
const eventRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const eventController = require("../controllers/event.controller");

eventRouter.post("/", authMiddleware, eventController.createEvent);
eventRouter.get("/", authMiddleware, eventController.fetchAllEvents);
eventRouter.put("/:id", authMiddleware, eventController.updateEvent);
eventRouter.delete("/:id", authMiddleware, eventController.deleteEvent);
eventRouter.post(
  "/:id/register",
  authMiddleware,
  eventController.registerEvent
);
eventRouter.post(
  "/:id/register",
  authMiddleware,
  eventController.deregisterEvent
);

module.exports = eventRouter;
