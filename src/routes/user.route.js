const express = require("express");
const router = express.Router();

const settings = require("../settings");

const { userController } = require("../controllers");

router.post(settings.userUrls.authorize, userController.authorize);

module.exports = router;