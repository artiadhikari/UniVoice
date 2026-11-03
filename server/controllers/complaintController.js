const db = require("../database/db");
const { randomUUID } = require("crypto");
const { analyzeComplaint } = require("../services/geminiService");
// Submit a new complaint
const createComplaint = (req, res) => {
  try {
    const {
      student_id,
      student_name,
      category,
      hostel,
      room_number,
      description,
      priority,
    } = req.body;

    // Validate required fields
    if (
      !student_id ||
      !student_name ||
      !category ||
      !hostel ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required complaint details.",
      });
    }

    // Generate unique ticket ID
    const ticket_id = `UNI-${Date.now()}-${randomUUID()
      .slice(0, 6)
      .toUpperCase()}`;

    // Save complaint in SQLite
    const statement = db.prepare(`
      INSERT INTO complaints (
        ticket_id,
        student_id,
        student_name,
        category,
        hostel,
        room_number,
        description,
        priority
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    statement.run(
      ticket_id,
      student_id,
      student_name,
      category,
      hostel,
      room_number || null,
      description,
      priority || "Medium"
    );

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully!",
      ticket_id,
    });
  } catch (error) {
    console.error("Complaint submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting your complaint.",
    });
  }
};
// Analyze spoken complaint using Gemini AI
const analyzeComplaintController = async (req, res) => {
  try {
    const { transcript, language, previousData } = req.body;

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({
        success: false,
        message: "Complaint transcript is required.",
      });
    }

const analysis = await analyzeComplaint(
  transcript,
  language || "English",
  previousData || null
);

    return res.status(200).json({
      success: true,
      message: "Complaint analyzed successfully!",
      data: analysis,
    });

  } catch (error) {
    console.error("Gemini analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "AI could not analyze the complaint. Please try again.",
    });
  }
};
// Track complaint using ticket ID
const trackComplaint = (req, res) => {
  try {
    const { ticketId } = req.params;

    const complaint = db.prepare(`
      SELECT
        ticket_id,
        category,
        hostel,
        room_number,
        description,
        priority,
        status,
        created_at,
        updated_at
      FROM complaints
      WHERE ticket_id = ?
    `).get(ticketId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found. Please check your ticket ID.",
      });
    }

    return res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("Tracking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to track complaint.",
    });
  }
};

const getMyComplaints = (req, res) => {
  try {
    const { student_id } = req.query;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required.",
      });
    }

    const complaints = db.prepare(`
      SELECT
        ticket_id,
        category,
        hostel,
        room_number,
        description,
        priority,
        status,
        created_at,
        updated_at
      FROM complaints
      WHERE student_id = ?
      ORDER BY created_at DESC
    `).all(student_id);

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });

  } catch (error) {
    console.error("My complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch complaints.",
    });
  }
};


// Admin: Get all complaints
const getAllComplaints = (req, res) => {
  try {
    const complaints = db.prepare(`
      SELECT * FROM complaints
      ORDER BY created_at DESC
    `).all();

    res.json({
      success: true,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
    });
  }
};

// Admin: Update complaint status
const updateComplaintStatus = (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "In Progress", "Resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status",
      });
    }

    // Find the complaint first
    const complaint = db.prepare(`
      SELECT student_id, status
      FROM complaints
      WHERE ticket_id = ?
    `).get(ticketId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Update complaint status
    db.prepare(`
      UPDATE complaints
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE ticket_id = ?
    `).run(status, ticketId);

    // Create notification only when status actually changes
    if (complaint.status !== status) {
      db.prepare(`
        INSERT INTO notifications (student_id, ticket_id, message)
        VALUES (?, ?, ?)
      `).run(
        complaint.student_id,
        ticketId,
        `Your complaint ${ticketId} is now ${status}.`
      );
    }

    res.json({
      success: true,
      message: "Complaint status updated successfully",
    });

  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update complaint status",
    });
  }
};

// Get notifications for a student
const getStudentNotifications = (req, res) => {
  try {
    const { student_id } = req.query;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const notifications = db.prepare(`
      SELECT *
      FROM notifications
      WHERE student_id = ?
      ORDER BY created_at DESC
    `).all(student_id);

    res.json({
      success: true,
      notifications,
    });

  } catch (error) {
    console.error("Notification fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};


// Mark notification as read
const markNotificationRead = (req, res) => {
  try {
    const { id } = req.params;

    const result = db.prepare(`
      UPDATE notifications
      SET is_read = 1
      WHERE id = ?
    `).run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
    });

  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

module.exports = {
  createComplaint,
  analyzeComplaintController,
  trackComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  getStudentNotifications,
  markNotificationRead,
};