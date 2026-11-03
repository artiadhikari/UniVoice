import { useState } from "react";
import axios from "axios";
import { Mic, MicOff, ArrowLeft, Send, Languages } from "lucide-react";
import "./ComplaintForm.css";



function ComplaintForm({ onBack }) {
  const [language, setLanguage] = useState("en-IN");
  const [description, setDescription] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

const [studentId, setStudentId] = useState("STU001");
  const [studentName, setStudentName] = useState("Demo Student");
  const [category, setCategory] = useState("Electricity");
  const [hostel, setHostel] = useState("Hostel A");
  const [roomNumber, setRoomNumber] = useState("204");
  

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

  const handleSubmit = async () => {
  try {
    setError("");

    const response = await axios.post(
      "http://localhost:5000/api/complaints",
      {
        student_id: studentId,
        student_name: studentName,
        category,
        hostel,
        room_number: roomNumber,
        description,
        priority: "Medium",
      }
    );

    if (response.data.success) {
      const ticketId = response.data.ticket_id;

      alert(`Complaint submitted successfully!\nYour Ticket ID: ${ticketId}`);

      const speech = new SpeechSynthesisUtterance(
        `Your complaint has been submitted successfully. Your ticket number is ${ticketId}.`
      );
      speech.lang = "en-IN";
      window.speechSynthesis.speak(speech);

      setDescription("");
      onBack();
    }
  } catch (err) {
    console.error("Submission error:", err);
    setError(
      err.response?.data?.message ||
      "Unable to submit complaint. Please check your connection."
    );
  }
};
  return (
    <div className="complaint-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="complaint-heading">
        <span className="eyebrow">STUDENT SUPPORT</span>
        <h1>Raise your voice.</h1>
        <p>Tell us what's wrong. We're here to listen and help.</p>
      </div>

      <div className="complaint-card">
        <label className="field-label">Student ID</label>
<input
  className="complaint-input"
  value={studentId}
  onChange={(e) => setStudentId(e.target.value)}
/>

<label className="field-label">Student Name</label>
<input
  className="complaint-input"
  value={studentName}
  onChange={(e) => setStudentName(e.target.value)}
/>

<label className="field-label">Complaint Category</label>
<select
  className="complaint-input"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option>Electricity</option>
  <option>Water</option>
  <option>Cleaning</option>
  <option>Internet</option>
  <option>Maintenance</option>
  <option>Other</option>
</select>

<label className="field-label">Hostel</label>
<input
  className="complaint-input"
  value={hostel}
  onChange={(e) => setHostel(e.target.value)}
/>

<label className="field-label">Room Number</label>
<input
  className="complaint-input"
  value={roomNumber}
  onChange={(e) => setRoomNumber(e.target.value)}
/>
        <div className="voice-header">
          <div>
            <h2>Describe your issue</h2>
            <p>Speak naturally or type your complaint below.</p>
          </div>
          <Languages size={23} />
        </div>

        <label className="field-label">Choose your language</label>
        <select
          className="complaint-input"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en-IN">English</option>
          <option value="hi-IN">हिन्दी (Hindi)</option>
          <option value="gu-IN">ગુજરાતી (Gujarati)</option>
        </select>

        <div className="voice-box">
          <button
            className={`mic-button ${listening ? "recording" : ""}`}
            onClick={startListening}
            disabled={listening}
          >
            {listening ? <MicOff size={28} /> : <Mic size={28} />}
          </button>
          <h3>{listening ? "Listening..." : "Tap to speak"}</h3>
          <p>
            {listening
              ? "Speak clearly. We're listening."
              : "Your voice will be converted into text."}
          </p>
        </div>

        {error && <p className="voice-error">{error}</p>}

        <label className="field-label">Your complaint</label>
        <textarea
          className="complaint-textarea"
          placeholder="Describe your problem here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />

        <p className="character-count">{description.length} characters</p>

       <button
  className="submit-complaint"
  disabled={!description.trim()}
  onClick={handleSubmit}
>
  Submit Complaint <Send size={17} />
</button>
      </div>
    </div>
  );
}

export default ComplaintForm;