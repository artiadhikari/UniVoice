# UniVoice
### Voice-Powered Campus Grievance Management System

UniVoice is a voice-first campus grievance management application developed for the Parul University context. It allows students to report hostel and campus-related issues through natural speech. The system uses Google Gemini to understand complaints, extract relevant information, identify missing details, and convert spoken input into structured complaint records.

Students can submit complaints, receive a unique ticket ID, track complaint status, and receive in-app notifications. Administrators can view submitted complaints and update their status through a separate dashboard.

## Live Demo

- **Frontend:** https://uni-voice-gules.vercel.app/
- **Backend:** https://univoice-1639.onrender.com
- **GitHub Repository:** https://github.com/artiadhikari/UniVoice

## Features

### Student Portal
- **Voice-based complaint submission:** Students can describe issues using speech instead of filling out a conventional complaint form.
- **Multilingual input:** Language selection includes English, Hindi, and Gujarati.
- **AI complaint analysis:** Gemini extracts the complaint category, description, hostel, room number, location details, and priority.
- **Context-aware follow-up:** The system identifies missing essential information and asks relevant follow-up questions. Responses are processed with the previous complaint context.
- **Complaint review:** Students can review the extracted complaint details before submitting.
- **Automatic ticket generation:** Each successfully submitted complaint receives a unique ticket ID.
- **Dashboard statistics:** Displays total, pending, in-progress, and resolved complaints.
- **My Complaints:** Displays previously submitted complaints and their current status.
- **Ticket tracking:** Allows a complaint to be retrieved using its ticket ID.
- **Notifications:** Students receive in-app notifications when administrators change complaint status. Unread notifications are highlighted and can be marked as read.
- **Voice responses:** Browser speech synthesis reads follow-up questions and submission confirmations aloud.

### Admin Portal
- **Complaint overview:** Displays all submitted complaints.
- **Dashboard statistics:** Shows total complaints and counts by status.
- **Complaint management:** Displays ticket ID, student details, category, description, hostel, priority, and current status.
- **Status updates:** Administrators can change a complaint's status to Pending, In Progress, or Resolved.
- **Automatic notifications:** A notification is created for the associated student when a complaint's status changes.

## Application Workflow

1. The student selects the Student Portal.
2. The student selects a language and describes the issue using the microphone.
3. The browser's Web Speech API converts speech into text.
4. The transcript is sent to the Express backend.
5. The backend sends the complaint and selected language to Google Gemini.
6. Gemini extracts structured complaint details and identifies missing essential information.
7. If additional information is required, the application asks a follow-up question through text and voice.
8. The student's response is analyzed along with the previously extracted complaint data.
9. Once the required information is available, the student reviews the complaint.
10. After confirmation, the backend generates a unique ticket ID and stores the complaint in SQLite.
11. The student receives a submission confirmation with spoken ticket information.
12. The administrator views the complaint and updates its status.
13. The student receives an in-app notification reflecting the status change.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| UI and Icons | Lucide React |
| Navigation | React Router DOM |
| API Communication | Axios |
| Backend | Node.js, Express.js |
| Database | SQLite, better-sqlite3 |
| AI Processing | Google Gemini API (`gemini-2.5-flash`) |
| Speech Recognition | Web Speech API |
| Voice Output | SpeechSynthesis API |
| Deployment | Vercel, Render |
| Version Control | Git, GitHub |

## Project Architecture

UniVoice follows a client-server architecture.

- **Frontend:** Handles portal selection, voice input, complaint review, student dashboard, notifications, and administration interface.
- **Backend:** Provides REST APIs for complaint analysis, submission, tracking, status management, and notifications.
- **AI Service:** Uses Gemini to interpret spoken complaints and return structured JSON containing extracted details and missing information.
- **Database:** Stores complaints and notifications in SQLite.

The frontend communicates with the backend through HTTP requests using Axios. The backend processes requests through Express routes and controllers, while the Gemini service handles AI-based complaint analysis.

## Project Structure

```text
UniVoice-VocalLabs/
│
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── PortalSelect.jsx
│   │   │   └── PortalSelect.css
│   │   │
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminDashboard.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── ComplaintForm.jsx
│   │   ├── ComplaintForm.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   └── complaintController.js
│   │
│   ├── database/
│   │   ├── db.js
│   │   └── schema.sql
│   │
│   ├── routes/
│   │   └── complaintRoutes.js
│   │
│   ├── services/
│   │   └── geminiService.js
│   │
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── LICENSE
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- Git
- Google Gemini API key
- A modern browser with Web Speech API support for voice interaction

### 1. Clone the Repository

```bash
git clone https://github.com/artiadhikari/UniVoice.git
cd UniVoice-VocalLabs
```

If your cloned repository directory has a different name, navigate into that directory instead.

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
```

Replace `your_gemini_api_key` with your Google Gemini API key.

The API key must remain on the backend and should never be exposed in frontend code or committed to GitHub.

### 4. Start the Backend

```bash
npm run dev
```

The backend starts at:

```text
http://localhost:5000
```

The root endpoint can be used to check whether the API is running:

```text
http://localhost:5000/
```

### 5. Install Frontend Dependencies

Open a second terminal and navigate to the client directory:

```bash
cd client
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

Vite will display the local development URL, usually:

```text
http://localhost:5173
```

Open this URL in your browser to access UniVoice.

**Note:** The current frontend source uses `http://localhost:5000/api/complaints` directly in its API requests. If you deploy the application or use a different backend URL, update the API base URLs in the frontend accordingly.

## Database

UniVoice uses SQLite with `better-sqlite3` for data storage. The database connection is initialized in `server/database/db.js`, and the schema is defined in `server/database/schema.sql`.

The application uses two primary tables.

### Complaints

Stores submitted complaint records.

| Column | Purpose |
|---|---|
| `id` | Internal primary key |
| `ticket_id` | Unique complaint ticket identifier |
| `student_id` | Identifier of the submitting student |
| `student_name` | Student name |
| `category` | Complaint category |
| `hostel` | Hostel name |
| `room_number` | Room number, if provided |
| `description` | Structured complaint description |
| `priority` | Low, Medium, or High |
| `status` | Pending, In Progress, or Resolved |
| `created_at` | Complaint creation timestamp |
| `updated_at` | Last status update timestamp |

### Notifications

Stores complaint status notifications.

| Column | Purpose |
|---|---|
| `id` | Notification primary key |
| `student_id` | Student receiving the notification |
| `ticket_id` | Associated complaint ticket |
| `message` | Notification content |
| `is_read` | Read/unread indicator |
| `created_at` | Notification creation timestamp |

The database and tables are initialized automatically when the backend starts.

## API Reference

All complaint-related endpoints use the `/api/complaints` base path.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Checks backend availability |
| `POST` | `/analyze` | Analyzes complaint text using Gemini |
| `POST` | `/` | Creates and stores a complaint |
| `GET` | `/my?student_id=STU001` | Retrieves complaints for a student |
| `GET` | `/track/:ticketId` | Retrieves complaint details by ticket ID |
| `GET` | `/` | Retrieves all complaints for the admin dashboard |
| `PATCH` | `/:ticketId/status` | Updates complaint status |
| `GET` | `/notifications?student_id=STU001` | Retrieves student notifications |
| `PATCH` | `/notifications/:id/read` | Marks a notification as read |

### Complaint Analysis

`POST /api/complaints/analyze`

Accepts the spoken transcript, selected language, and optional previously extracted complaint data. Returns structured complaint information, missing fields, and a follow-up question when required.

### Complaint Submission

`POST /api/complaints`

Stores the confirmed complaint and returns its generated ticket ID.

### Complaint Status Update

`PATCH /api/complaints/:ticketId/status`

Updates the complaint status. When the status actually changes, the backend creates a notification for the associated student.

## AI Processing

UniVoice uses Google's Gemini model through the `@google/genai` SDK.

The AI service is implemented in:

```text
server/services/geminiService.js
```

The service receives:
- The student's spoken transcript.
- The selected language.
- Previously extracted complaint information, when available.

Gemini returns structured JSON containing:

- `category`
- `description`
- `hostel`
- `room_number`
- `location_details`
- `priority`
- `urgency_reason`
- `missing_fields`
- `follow_up_question`

The follow-up process uses the previous analysis as context. New responses are merged with existing information so that previously collected details are retained. The service is instructed not to invent missing information and to ask only for details essential to the complaint.

## Voice Implementation

### Speech Recognition

The frontend uses the browser's Web Speech API through `SpeechRecognition` or `webkitSpeechRecognition`.

The selected language is passed to the recognition instance. The recognized transcript is displayed in the complaint interface and sent to the backend for AI processing.

### Speech Synthesis

The browser's `SpeechSynthesis` API is used to speak follow-up questions and complaint submission confirmations.

Voice features depend on browser support and the availability of speech services on the user's device.

## Configuration and Security Notes

- Keep `server/.env` private and never commit API keys.
- The root `.gitignore` excludes environment files, dependency folders, build output, and SQLite database files.
- The current demo uses a predefined student profile (`STU001`, `Demo Student`).
- Student and Admin portal selection is a demonstration flow, not secure authentication or role-based access control.
- The current backend uses unrestricted CORS configuration. Production deployments should restrict allowed origins.
- The SQLite database is stored locally by the backend. On hosting platforms with ephemeral filesystems, configure persistent storage or migrate to a managed database to retain records across redeployments.

## Current Limitations

- Full student registration and secure login are not implemented.
- Admin access is not protected by authentication.
- Speech recognition quality and language availability depend on the browser and device.
- The application is not integrated with Parul University's official student database or grievance management system.
- Production-grade persistent database hosting and access control require additional configuration.

## Future Scope

- Secure student and administrator authentication.
- Role-based access control.
- Persistent production database integration.
- Expanded multilingual voice support.
- Complaint assignment and administrative remarks.
- Email and SMS notifications.
- Integration with official university systems, subject to authorization.

## Project Information

| Detail | Information |
|---|---|
| Project | UniVoice |
| Project Type | Voice-Powered Campus Grievance Management |
| Institution Context | Parul University |
| Development | Individual Project |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Repository | [UniVoice on GitHub](https://github.com/artiadhikari/UniVoice) |

## Author

**Arti Adhikari**

GitHub: [artiadhikari](https://github.com/artiadhikari)

---

UniVoice aims to simplify campus grievance reporting by combining natural voice interaction, AI-powered complaint understanding, automatic ticket generation, and transparent complaint tracking.
