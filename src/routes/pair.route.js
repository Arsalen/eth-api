const express = require("express");
const router = express.Router();

const settings = require("../settings");

const { auth } = require("../middelwares");

const { pairController } = require("../controllers");

router.post(settings.pairUrls.insert, auth, pairController.insert);

module.exports = router;