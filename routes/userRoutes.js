const express = require("express");
const router = express.Router();
const { createUser, insertUser } = require("../controllers/userController");

router.post("/", createUser);
router.post("/insert-user", insertUser);

module.exports = router;
