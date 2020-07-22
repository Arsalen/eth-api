const express = require("express");
const router = express.Router();

const settings = require("../settings");

const { txController } = require("../controllers");

router.post(settings.Urls.insert, txController.insert);
router.get(settings.Urls.select, txController.select);

router.post(settings.Urls.authorize, txController.authorize);

module.exports = router;