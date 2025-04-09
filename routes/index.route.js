const express = require("express");
const router = express.Router();

const userRouter = require("./user.route");
const eventRouter = require("./event.route");

router.use("/", userRouter);
router.use("/event", eventRouter);

module.exports = router;
