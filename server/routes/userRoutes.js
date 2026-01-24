const express = require("express");
const { completeProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/complete-profile", authMiddleware, completeProfile);

module.exports = router;
