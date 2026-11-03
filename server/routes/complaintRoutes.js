const express = require("express");
const router = express.Router();

const {
  createComplaint,
  analyzeComplaintController,
} = require("../controllers/complaintController");

// Analyze complaint using Gemini AI
router.post("/analyze", analyzeComplaintController);

// Submit analyzed complaint
router.post("/", createComplaint);

module.exports = router;