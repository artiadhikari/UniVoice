CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id TEXT UNIQUE NOT NULL,

    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,

    category TEXT NOT NULL,
    hostel TEXT NOT NULL,
    room_number TEXT,

    description TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium',

    status TEXT DEFAULT 'Pending',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);