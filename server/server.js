const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./database/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "UniVoice API is running!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` UniVoice server running at http://localhost:${PORT}`);
});