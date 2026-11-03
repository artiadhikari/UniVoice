const express = require("express");
const router = express.Router();

const {
  createComplaint,
} = require("../controllers/complaintController");

// POST /api/complaints
router.post("/", createComplaint);

module.exports = router;