const express = require("express");
const router = express.Router();
const { createRequest, getRequests, updateRequest } = require("../controllers/changeRequestController");

router.post("/", createRequest);
router.get("/", getRequests);
router.put("/", updateRequest);

module.exports = router;
