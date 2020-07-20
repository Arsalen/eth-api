const express = require("express");
const router = express.Router();

const settings = require("../settings");

const { txController } = require("../controllers");

router.post(settings.Urls.insert_tx, txController.insert);
router.get(settings.Urls.select_tx, txController.select);

module.exports = router;