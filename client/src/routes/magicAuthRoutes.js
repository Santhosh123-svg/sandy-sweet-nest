const express = require("express");
const {
  sendMagicLink,
  verifyMagicLink,
} = require("../src/controllers/magicAuthController");

const router = express.Router();

router.post("/send-link", sendMagicLink);
router.get("/verify/:token", verifyMagicLink);

module.exports = router;
