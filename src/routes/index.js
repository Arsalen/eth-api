const express = require("express");
const router = express.Router();

const settings = require("../settings");

const txRouter = require("./transaction.route");

router.use(settings.Urls.root, txRouter);

module.exports = router;