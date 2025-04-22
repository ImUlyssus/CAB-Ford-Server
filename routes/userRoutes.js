const express = require("express");
const router = express.Router();
const { createUser, insertUser, getAllUsers, resetPassword } = require("../controllers/userController");

router.post("/", createUser);
router.post("/insert-user", insertUser);
router.post('/reset-password', resetPassword);
router.get('/', getAllUsers);

module.exports = router;
