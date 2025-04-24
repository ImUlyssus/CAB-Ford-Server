const express = require("express");
const router = express.Router();
const { createInformational } = require("../controllers/informationalController");

router.post("/", createInformational);

module.exports = router;
