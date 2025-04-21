const express = require("express");
const router = express.Router();
const { getCalendar, updateCalendar } = require("../controllers/businessCalendarController");

router.get("/:year", getCalendar);
router.post("/update", updateCalendar);

module.exports = router;
