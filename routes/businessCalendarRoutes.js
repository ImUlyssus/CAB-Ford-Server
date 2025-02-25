const express = require("express");
const router = express.Router();
const { getCalendar } = require("../controllers/businessCalendarController");

router.get("/:year", getCalendar);

module.exports = router;
