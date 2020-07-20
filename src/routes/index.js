const express = require("express");
const router = express.Router();

const settings = require("../settings");

const txRouter = require("./transaction");

router.use(settings.Urls.root_tx, txRouter);

module.exports = router;