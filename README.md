# Faculty Portal

A comprehensive faculty portal for managing timetables, courses, and student attendance.

## Project Structure

```
faculty-portal/
├── frontend/                 # React application
├── backend/                  # Node.js API server
├── shared/                   # Shared types/utilities
└── docs/                     # Documentation
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **Authentication**: JWT tokens
- **File Upload**: Multer, Google Vision API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
# Set up your .env file with DATABASE_URL
npx prisma migrate dev
npm run dev
```

### Environment Variables

Create a `.env` file in the backend directory with:

```
DATABASE_URL="postgresql://username:password@localhost:5432/faculty_portal"
JWT_SECRET="your-secret-key"
```

## Features

- Faculty Authentication
- Course Management
- Timetable Management with OCR
- Student Attendance Tracking
- Analytics Dashboard

## Development Status

Currently in Phase 1: Foundation Setup
