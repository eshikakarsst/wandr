🌍 Smart Travel Planner

A full-stack React + Firebase web application that helps users plan trips intelligently based on budget, destinations, itinerary, and document tracking — all in one place.

Built as part of the End-Term Project – Building Web Applications with React (Batch 2029)

🎯 Problem Statement

Planning trips manually is difficult because travelers often:

lose track of budgets 💸
forget required travel documents 📄
struggle organizing itineraries 🗺️
switch between multiple apps to manage everything
👤 Target Users
Students planning trips
Solo travelers
Families organizing vacations
Anyone needing structured trip planning
✅ Solution

Smart Travel Planner provides a centralized platform where users can:

create trips
manage travel budgets
organize itineraries
track required documents
store trip data securely

This reduces planning stress and improves travel preparation efficiency.

🚀 Features
🔐 Authentication System
User Signup/Login
Firebase Authentication
Persistent sessions
Protected routes
📊 Dashboard

After login, users see:

all created trips
quick overview of budgets
upcoming travel plans
navigation to planner tools
🧳 Trip Management (CRUD)

Users can:

Create new trips
View trip details
Update trip information
Delete trips

Stored using Firebase Firestore

💰 Budget Planner

Users can:

set total trip budget
track expenses
monitor remaining balance

Helps avoid overspending.

🗓️ Itinerary Planner

Users can:

add daily plans
organize activities
manage schedules

Ensures structured trip flow.

📄 Document Checklist

Users can track:

Passport
Visa
Tickets
Hotel bookings
Custom documents

Prevents missing important paperwork.

🧠 React Concepts Used
Core Concepts ✅
Functional Components
Props
useState
useEffect
Conditional Rendering
Lists & Keys
Intermediate Concepts ✅
Lifting State Up
Controlled Components
React Router
Context API (Global State)
Advanced Concepts ✅
useMemo (performance optimization)
useCallback
useRef
Lazy Loading using React.lazy + Suspense
🔥 Tech Stack
Frontend
React (Vite)
React Router
Context API
Tailwind CSS
Backend
Firebase Authentication
Firebase Firestore Database
Deployment
Vercel / Netlify
📁 Project Structure
src/
│
├── components/
├── pages/
├── hooks/
├── context/
├── services/
├── utils/
└── App.jsx
⚙️ Installation & Setup
Step 1: Clone Repository
git clone https://github.com/yourusername/smart-travel-planner.git
Step 2: Navigate to Project
cd smart-travel-planner
Step 3: Install Dependencies
npm install
Step 4: Setup Environment Variables

Create .env file:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Step 5: Run Project
npm run dev
🔐 Firebase Features Used
Authentication (Signup/Login)
Firestore Database
Protected Routes
Persistent User Data Storage
CRUD Operations
📊 Application Workflow
User Signup/Login
        ↓
Dashboard
        ↓
Create Trip
        ↓
Add Budget + Itinerary + Documents
        ↓
Data stored in Firestore
🎨 UI/UX Features
Responsive Design (Mobile + Desktop)
Clean layout using Tailwind CSS
Loading indicators
Error handling messages
Protected navigation routes
🌐 Live Demo
https://end-term-project-term-3.vercel.app/
🎥 Demo Video

Explain in video:

Problem Statement
Features walkthrough
React architecture
Firebase integration

Duration: 3–5 minutes

📈 Evaluation Criteria Coverage

This project demonstrates:

✅ React Fundamentals
✅ Advanced Hooks Usage
✅ Backend Integration
✅ Authentication System
✅ CRUD Operations
✅ Clean UI/UX
✅ Real-world problem solving

🧑‍💻 Author

Eshika Kar
Batch 2029
Course: Building Web Applications with React

⭐ Future Improvements

Planned upgrades:

AI travel suggestions
Expense analytics charts
Group trip collaboration
Google Maps integration
Export itinerary as PDF


📄 License
This project is created for educational purposes as part of a course end-term project.

