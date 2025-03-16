const express = require("express");
const router = express.Router();
const { createRequest, getRequests, updateRequest, deleteRequest } = require("../controllers/changeRequestController");

router.post("/", createRequest);
router.get("/", getRequests);
router.put("/", updateRequest);
router.delete("/:id", deleteRequest);

module.exports = router;
