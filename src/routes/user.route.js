const express = require("express");
const router = express.Router();

const settings = require("../settings");

const { sign } = require("../middelwares");

const { userController } = require("../controllers");

router.post(settings.userUrls.authorize, sign.authorize, userController.authorize);

module.exports = router;