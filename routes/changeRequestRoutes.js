const express = require("express");
const router = express.Router();
const { createRequest, getRequests, updateRequest, deleteRequest, getRequestsForTwoYears, getRequestsForChosenYear, getFilteredData, getWeeklyData, updateCheck, forceUpdateRequest, getCustomDateData } = require("../controllers/changeRequestController");

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/two-year-data", getRequestsForTwoYears);
router.get("/year/:year", getRequestsForChosenYear);
router.get("/get-filtered-data", getFilteredData);
router.get("/get-four-week-data", getWeeklyData);
router.get("/custom-date", getCustomDateData);
router.put("/", updateRequest);
router.put("/check-to-update", updateCheck);
router.put("/force-update", forceUpdateRequest);
router.delete("/:id", deleteRequest);

module.exports = router;
