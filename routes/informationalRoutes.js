const express = require("express");
const router = express.Router();
const { createInformational, getInformational, deleteInformational } = require("../controllers/informationalController");

router.post("/", createInformational);
router.get("/", getInformational);
router.delete("/:id", deleteInformational);

module.exports = router;
