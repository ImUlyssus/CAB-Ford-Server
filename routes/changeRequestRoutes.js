const express = require("express");
const router = express.Router();
const { createRequest, getRequests, updateRequest, deleteRequest, getRequestsForTwoYears, getRequestsForChosenYear, getFilteredData } = require("../controllers/changeRequestController");

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/two-year-data", getRequestsForTwoYears);
router.get("/year/:year", getRequestsForChosenYear);
router.get("/get-filtered-data", getFilteredData);
router.put("/", updateRequest);
router.delete("/:id", deleteRequest);

module.exports = router;
