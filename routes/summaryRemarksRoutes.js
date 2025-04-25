const express = require("express");
const router = express.Router();
const { createRemarksSummary, getRemarksSummary, deleteRemarksSummary } = require("../controllers/remarksSummaryController");

router.post("/", createRemarksSummary);
router.get("/", getRemarksSummary);
router.delete("/:id", deleteRemarksSummary);

module.exports = router;
