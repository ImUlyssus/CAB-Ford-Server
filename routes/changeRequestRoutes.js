const express = require("express");
const router = express.Router();
const { createRequest, getRequests, updateRequest, deleteRequest, getRequestsForTwoYears, getRequestsForChosenYear, getFilteredData, getWeeklyData, updateCheck, forceUpdateRequest, getCustomDateData, getVersionHistory, getVHRequestDetails, goBackUpdate, getThisWeekData, getCustomPresentationData, getDownloadExcelData } = require("../controllers/changeRequestController");

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/two-year-data", getRequestsForTwoYears);
router.get("/year/:year", getRequestsForChosenYear);
router.get("/get-filtered-data", getFilteredData);
router.get("/get-four-week-data", getWeeklyData);
router.get("/version-history", getVersionHistory);
router.get("/custom-date", getCustomDateData);
router.get("/custom-date-presentation", getCustomPresentationData);
router.get('/details/:id', getVHRequestDetails);
router.get('/get-this-week-data', getThisWeekData);
router.get('/download-excel', getDownloadExcelData);
router.put("/", updateRequest);
router.put("/check-to-update", updateCheck);
router.put("/force-update", forceUpdateRequest);
router.put("/go-back-update",goBackUpdate)
router.delete("/:id", deleteRequest);

module.exports = router;
