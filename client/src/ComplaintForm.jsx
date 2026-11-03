import { useState } from "react";
import axios from "axios";
import { Mic, MicOff, ArrowLeft, Send, Languages } from "lucide-react";
import "./ComplaintForm.css";

function ComplaintForm({ onBack }) {
  const [language, setLanguage] = useState("en-IN");
  const [description, setDescription] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [submittedTicket, setSubmittedTicket] = useState("");

  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [studentId] = useState("STU001");
  const [studentName] = useState("Demo Student");

  const missingFields = Array.isArray(analysis?.missing_fields)
    ? analysis.missing_fields
    : [];

  const needsFollowUp = missingFields.length > 0;

  // Speak a question or confirmation aloud
  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language;
    window.speechSynthesis.speak(speech);
  };

  // Capture the student's voice
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription((previous) =>
        previous ? `${previous} ${transcript}` : transcript
      );
    };

    recognition.onerror = () => {
      setError("Could not recognize speech. Please try again.");
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  // Initial complaint analysis
  const handleAnalyze = async () => {
    try {
      setError("");
      setAnalyzing(true);

      const response = await axios.post(
        "http://localhost:5000/api/complaints/analyze",
        {
          transcript: description,
          language,
          previousData: null,
        }
      );

      if (response.data.success) {
        const result = response.data.data;
        setAnalysis(result);
        setDescription("");

        if (result.follow_up_question) {
          speak(result.follow_up_question);
        } else if (result.missing_fields?.length) {
          speak("I need a few more details. Please tell me your hostel and location.");
        }
      }
    } catch (err) {
      console.error("Gemini analysis error:", err);
      setError(
        err.response?.data?.message ||
          "AI analysis failed. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // Send the student's follow-up answer to Gemini
  const handleFollowUp = async () => {
    if (!description.trim()) {
      setError("Please speak your answer first.");
      return;
    }

    try {
      setError("");
      setAnalyzing(true);

      const response = await axios.post(
        "http://localhost:5000/api/complaints/analyze",
        {
          transcript: description,
          language,
          previousData: analysis,
        }
      );

      if (response.data.success) {
        const result = response.data.data;
        setAnalysis(result);
        setDescription("");

        if (result.follow_up_question) {
          speak(result.follow_up_question);
        } else if (result.missing_fields?.length) {
          speak("I still need a little more information. Please tell me the missing details.");
        } else {
          speak("Thank you. I have all the required complaint details. Please review them before submitting.");
        }
      }
    } catch (err) {
      console.error("Follow-up error:", err);
      setError(
        err.response?.data?.message ||
          "Could not process your answer. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // Submit the final analyzed complaint
  const handleSubmit = async () => {
    if (needsFollowUp) {
      setError("Please answer the remaining questions first.");
      return;
    }

    if (!analysis?.hostel || !analysis?.description) {
      setError("Hostel and complaint description are required. Please provide the missing details.");
      return;
    }

    try {
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/complaints",
        {
          student_id: studentId,
          student_name: studentName,
          category: analysis.category,
          hostel: analysis.hostel,
          room_number: analysis.room_number,
          description: analysis.description,
          priority: analysis.priority,
        }
      );

      if (response.data.success) {
        const ticketId = response.data.ticket_id;
        setSubmittedTicket(ticketId);

        speak(
          `Your complaint has been submitted successfully. Your ticket number is ${ticketId}.`
        );
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to submit complaint. Please check your connection."
      );
    }
  };

  // Leave the form and return to the student dashboard
  const handleBackToDashboard = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    setDescription("");
    setAnalysis(null);
    setError("");
    onBack();
  };

  // Success screen
  if (submittedTicket) {
    return (
      <div className="complaint-container">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <h2>Complaint Submitted Successfully!</h2>
          <p>Your complaint has been registered.</p>

          <div className="ticket-box">
            <span>Your Ticket ID</span>
            <h3>{submittedTicket}</h3>
            <span className="pending-status">Pending</span>
          </div>

          <p>You can use this ticket ID to track your complaint.</p>

          <button
            className="submit-complaint"
            onClick={() => {
              setSubmittedTicket("");
              setDescription("");
              setAnalysis(null);
              onBack();
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="complaint-page">
      <button className="back-button" onClick={handleBackToDashboard}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="complaint-layout">
        {/* Left column: heading, language, follow-up question */}
        <div className="complaint-left">
          <div className="complaint-heading">
            <span className="eyebrow">STUDENT SUPPORT</span>
            <h1>Raise your voice.</h1>
            <p>Tell us what's wrong. We're here to listen and help.</p>
          </div>

          <div className="voice-header">
            <div>
              <h2>
                {needsFollowUp ? "Let's get a few more details" : "Describe your issue"}
              </h2>
              <p>
                {needsFollowUp
                  ? "UniVoice has a follow-up question for you."
                  : "Speak naturally. UniVoice will understand your complaint."}
              </p>
            </div>
            <Languages size={23} />
          </div>

          <label className="field-label">Choose your language</label>
          <select
            className="complaint-input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={!!analysis}
          >
            <option value="en-IN">English</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
            <option value="gu-IN">ગુજરાતી (Gujarati)</option>
          </select>

          {analysis && needsFollowUp && (
            <div className="ai-preview">
              <h2>🤖 UniVoice wants to know</h2>
              <p>
                {analysis.follow_up_question ||
                  "Please provide the remaining essential complaint details."}
              </p>
              <p className="ai-reason">
                Still needed: {missingFields.join(", ").replaceAll("_", " ")}
              </p>
            </div>
          )}
        </div>

        {/* Right column: voice input, answer, actions */}
        <div className="complaint-right">
          <div className="voice-box">
            <button
              className={`mic-button ${listening ? "recording" : ""}`}
              onClick={startListening}
              disabled={listening || analyzing}
            >
              {listening ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            <h3>{listening ? "Listening..." : "Tap to speak"}</h3>

            <p>
              {listening
                ? "Speak clearly. We're listening."
                : needsFollowUp
                  ? "Answer UniVoice's question using your voice."
                  : "Your voice will be converted into text."}
            </p>
          </div>

          {error && <p className="voice-error">{error}</p>}

          {analyzing && (
            <div className="ai-loading">
              <span>✨</span>
              <p>UniVoice AI is processing your response...</p>
            </div>
          )}

          <label className="field-label">
            {needsFollowUp ? "Your answer" : "Your spoken complaint"}
          </label>

          <textarea
            className="complaint-textarea"
            placeholder={
              needsFollowUp
                ? "Your spoken answer will appear here..."
                : "Your spoken complaint will appear here..."
            }
            value={description}
            readOnly
            rows={4}
          />

          <p className="character-count">{description.length} characters</p>

          {!analysis ? (
            <button
              className="submit-complaint"
              disabled={!description.trim() || analyzing}
              onClick={handleAnalyze}
            >
              {analyzing ? "Analyzing..." : "✨ Analyze My Complaint"}
            </button>
          ) : needsFollowUp ? (
            <button
              className="submit-complaint"
              disabled={!description.trim() || analyzing}
              onClick={handleFollowUp}
            >
              {analyzing ? "Processing..." : "Send Answer"} <Send size={17} />
            </button>
          ) : (
            <div className="ai-preview">
              <h2>✨ Final Complaint Review</h2>
              <p>Please review your details before submission.</p>

              <div className="ai-detail">
                <strong>Category</strong>
                <span>{analysis.category}</span>
              </div>

              <div className="ai-detail">
                <strong>Hostel</strong>
                <span>{analysis.hostel}</span>
              </div>

              <div className="ai-detail">
                <strong>Room Number</strong>
                <span>{analysis.room_number || "Not provided"}</span>
              </div>

              <div className="ai-detail">
                <strong>Location</strong>
                <span>{analysis.location_details || "Not provided"}</span>
              </div>

              <div className="ai-detail">
                <strong>Priority</strong>
                <span>{analysis.priority}</span>
              </div>

              <div className="ai-detail">
                <strong>Complaint</strong>
                <p>{analysis.description}</p>
              </div>

              <p className="ai-reason">{analysis.urgency_reason}</p>

              <button
                className="submit-complaint"
                onClick={handleSubmit}
              >
                Confirm & Submit <Send size={17} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintForm;