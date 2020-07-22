const express = require("express");
const router = express.Router();

const settings = require("../settings");

const pairRouter = require("./pair.route");

router.use(settings.Urls.root, pairRouter);

module.exports = router;