const express = require("express");
const router = express.Router();

const settings = require("../settings");

const { pairController } = require("../controllers");

router.post(settings.Urls.insert, pairController.insert);
router.get(settings.Urls.select, pairController.select);

router.post(settings.Urls.authorize, pairController.authorize);

module.exports = router;