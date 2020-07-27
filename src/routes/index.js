const express = require("express");
const router = express.Router();

const settings = require("../settings");

const pairRouter = require("./pair.route");
const userRouter = require("./user.route");

router.use(settings.pairUrls.root, pairRouter);
router.use(settings.userUrls.root, userRouter);

module.exports = router;