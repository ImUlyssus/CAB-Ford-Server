const express = require("express");
const router = express.Router();
const { createUser, insertUser, getAllUsers } = require("../controllers/userController");

router.post("/", createUser);
router.post("/insert-user", insertUser);
router.get('/', getAllUsers);

module.exports = router;
