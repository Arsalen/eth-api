const express = require("express");
const router = express.Router();

const settings = require("../settings");

const { pairController } = require("../controllers");

router.post(settings.pairUrls.insert, pairController.insert);

module.exports = router;