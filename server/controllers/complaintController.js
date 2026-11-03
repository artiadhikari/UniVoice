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


module.exports = {
  createComplaint,
  analyzeComplaintController,
  trackComplaint,
    getMyComplaints,
};