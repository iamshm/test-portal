# 🎓 Faculty Portal - Detailed Implementation Plan

## 📁 Project Structure

```
faculty-portal/
├── frontend/                 # React application
├── backend/                  # Node.js API server
├── shared/                   # Shared types/utilities
├── docs/                     # Documentation
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, Multer, Google Vision API
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **File Upload**: Cloudinary (free tier) or local storage

---

## 📋 Phase 1: Foundation Setup (Week 1)

### 1.1 Project Initialization

**AI Agent Tasks:**

1. Create parent directory `faculty-portal`
2. Initialize frontend React app with Vite
3. Initialize backend Node.js project
4. Set up shared directory for common types

**Frontend Setup:**

```bash
# In faculty-portal/frontend/
npm create vite@latest . -- --template react
npm install axios react-router-dom tailwindcss lucide-react
```

**Backend Setup:**

```bash
# In faculty-portal/backend/
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken
npm install multer @google-cloud/vision
npm install prisma @prisma/client
npm install -D nodemon
```

### 1.2 Database Schema Design

**Create these tables in PostgreSQL:**

```sql
-- Users (Faculty)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  course_code VARCHAR(50) NOT NULL,
  course_name VARCHAR(255),
  faculty_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timetable
CREATE TABLE timetable (
  id SERIAL PRIMARY KEY,
  faculty_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES courses(id),
  day_of_week VARCHAR(10) NOT NULL, -- 'Monday', 'Tuesday', etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  venue VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  course_id INTEGER REFERENCES courses(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  timetable_id INTEGER REFERENCES timetable(id),
  date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'present', -- 'present', 'absent'
  marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, timetable_id, date)
);
```

### 1.3 Basic Authentication

**Backend APIs to create:**

- `POST /api/auth/login` - Faculty login
- `POST /api/auth/register` - Faculty registration
- `GET /api/auth/me` - Get current user info

**Frontend Pages:**

- Login page (`/login`)
- Dashboard layout with navigation

---

## 📋 Phase 2: Image Processing & OCR (Week 2)

### 2.1 Google Vision API Integration

**Backend Implementation:**

1. Set up Google Vision API credentials
2. Create image upload endpoint
3. Process uploaded timetable images
4. Extract and parse timetable data

**Key APIs to build:**

```javascript
// POST /api/timetable/upload
// - Accept image file (png, jpg)
// - Use Google Vision API to extract text
// - Parse extracted text for:
//   - Course codes (e.g., "CS101", "MATH201")
//   - Time slots (e.g., "9:00-10:00", "10:30-11:30")
//   - Days (Monday, Tuesday, etc.)
//   - Venues (e.g., "Room 101", "Lab A")
// - Store parsed data in database
```

### 2.2 OCR Text Parsing Logic

**Text Processing Strategy:**

1. **Pattern Recognition:**

   - Course codes: Regex for alphanumeric patterns (CS101, MATH201)
   - Time slots: Regex for time patterns (9:00-10:00, 2:30-3:30)
   - Days: Look for weekday names
   - Venues: Text following location keywords

2. **Data Validation:**
   - Verify extracted times are valid
   - Check course codes format
   - Validate day names

### 2.3 Frontend Upload Interface

**Pages to create:**

- Timetable upload page (`/upload-timetable`)
- Preview extracted data before saving
- Edit/correct extracted data manually

---

## 📋 Phase 3: Core Timetable Features (Week 3)

### 3.1 Timetable Management

**Backend APIs:**

```javascript
GET /api/timetable/my-schedule     // Get faculty's timetable
PUT /api/timetable/:id            // Update timetable entry
DELETE /api/timetable/:id         // Delete timetable entry
GET /api/courses/my-courses       // Get faculty's courses
```

**Frontend Components:**

1. **Weekly Timetable View:**

   - Grid layout showing days vs time slots
   - Display course code, venue for each slot
   - Click to view class details

2. **Timetable Management:**
   - Edit individual time slots
   - Add/remove classes manually
   - Bulk operations

### 3.2 Student Management

**Backend APIs:**

```javascript
GET /api/students/by-course/:courseId    // Get students in a course
POST /api/students                       // Add new student
PUT /api/students/:id                    // Update student info
DELETE /api/students/:id                 // Remove student
```

**Frontend Features:**

- Student list for each course
- Add/edit student information
- Import students from CSV (bonus)

---

## 📋 Phase 4: Attendance System (Week 4)

### 4.1 Attendance Marking

**Backend APIs:**

```javascript
GET /api/attendance/class/:timetableId/:date     // Get attendance for specific class
POST /api/attendance/mark                        // Mark attendance for students
GET /api/attendance/student/:studentId          // Get student's attendance history
GET /api/attendance/summary/:courseId           // Get course attendance summary
```

**Frontend Components:**

1. **Attendance Marking Interface:**

   - List all students in the class
   - Toggle present/absent for each student
   - Quick mark all present/absent buttons
   - Save attendance with timestamp

2. **Class Selection:**
   - Show today's classes
   - Select specific class to mark attendance
   - View upcoming classes

### 4.2 Attendance Analytics

**Data to display:**

- Individual student attendance percentage
- Class-wise attendance trends
- Weekly/monthly attendance reports
- Low attendance alerts

---

## 📋 Phase 5: Dashboard & Analytics (Week 5)

### 5.1 Main Dashboard

**Dashboard Components:**

1. **Today's Schedule:**

   - Current/next class highlight
   - Quick attendance marking
   - Class details (students count, venue)

2. **Quick Stats:**

   - Total courses taught
   - Total students
   - Average attendance rate
   - Recent activity

3. **Attendance Overview:**
   - Charts showing attendance trends
   - Course-wise attendance comparison
   - Monthly attendance calendar

### 5.2 Reporting Features

**Reports to generate:**

- Student attendance reports (exportable)
- Course performance summaries
- Weekly/monthly attendance trends
- Individual student progress

---

## 📋 Phase 6: Polish & Deployment (Week 6)

### 6.1 UI/UX Improvements

- Responsive design for mobile/tablet
- Loading states and error handling
- Form validations
- User feedback messages

### 6.2 Performance Optimization

- Image compression before upload
- Database query optimization
- Caching frequently accessed data
- API response optimization

### 6.3 Basic Deployment Setup

- Environment configuration
- Database migration scripts
- Basic CI/CD setup
- Documentation for deployment

---

## 🔧 Technical Implementation Details

### Database Relationships

```
users (faculty) 1 -> many courses
courses 1 -> many students
courses 1 -> many timetable_entries
timetable_entries 1 -> many attendance_records
students 1 -> many attendance_records
```

### API Authentication Flow

1. Faculty logs in with email/password
2. Server validates and returns JWT token
3. All subsequent requests include JWT in headers
4. Server validates JWT for protected routes

### Image Processing Workflow

1. Faculty uploads timetable image
2. Backend saves image temporarily
3. Google Vision API extracts text
4. Custom parser identifies timetable data
5. Extracted data shown for faculty review
6. Faculty confirms/edits data
7. Data saved to database
8. Temporary image deleted

### Frontend State Management

- Use React Context for user authentication
- Local state for form data
- API calls with proper error handling
- Loading states for better UX

## 📦 Key Dependencies

### Frontend

```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "axios": "^1.0.0",
  "tailwindcss": "^3.0.0",
  "lucide-react": "^0.200.0"
}
```

### Backend

```json
{
  "express": "^4.18.0",
  "prisma": "^5.0.0",
  "@prisma/client": "^5.0.0",
  "@google-cloud/vision": "^4.0.0",
  "multer": "^1.4.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.0"
}
```

## 🚀 Getting Started Commands

```bash
# Setup parent directory
mkdir faculty-portal && cd faculty-portal

# Frontend setup
mkdir frontend && cd frontend
npm create vite@latest . -- --template react
npm install
cd ..

# Backend setup
mkdir backend && cd backend
npm init -y
npm install express cors dotenv
cd ..

# Database setup
# Install PostgreSQL
# Create database 'faculty_portal'
# Run migration scripts
```

This plan provides everything your AI agent needs to implement a complete faculty portal with image-based timetable extraction, attendance management, and analytics dashboard.
