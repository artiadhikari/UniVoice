const express = require("express");
const router = express.Router();

const {
  createComplaint,
  analyzeComplaintController,
  trackComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  getStudentNotifications,
  markNotificationRead,
} = require("../controllers/complaintController");

// Student routes
router.get("/my", getMyComplaints);
router.get("/notifications", getStudentNotifications);
router.patch("/notifications/:id/read", markNotificationRead);

router.get("/track/:ticketId", trackComplaint);
router.post("/analyze", analyzeComplaintController);
router.post("/", createComplaint);

// Admin routes
router.get("/", getAllComplaints);
router.patch("/:ticketId/status", updateComplaintStatus);

module.exports = router;