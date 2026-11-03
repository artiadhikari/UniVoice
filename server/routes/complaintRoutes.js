
const express = require("express");
const router = express.Router();

const {
  createComplaint,
  analyzeComplaintController,
  trackComplaint,
  getMyComplaints,
} = require("../controllers/complaintController");

// Get all complaints submitted by a student
router.get("/my", getMyComplaints);

// Track a specific complaint
router.get("/track/:ticketId", trackComplaint);

// Analyze complaint using Gemini AI
router.post("/analyze", analyzeComplaintController);

// Submit complaint
router.post("/", createComplaint);

module.exports = router;
