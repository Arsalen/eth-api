const express = require("express");
const router = express.Router();

const settings = require("../settings");

const { pairController, userController } = require("../controllers");

router.post(settings.pairUrls.insert, userController.authenticate, pairController.insert);

module.exports = router;