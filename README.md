# 🌍 Smart Travel Planner

A **full-stack React + Firebase web application** that helps users plan trips intelligently by managing **budget, itinerary, and travel documents** in one centralized platform.

Built as part of the **End-Term Project – Building Web Applications with React (Batch 2029)**.

---

# 🚀 Live Demo
**📼 Demo Video :** https://drive.google.com/file/d/1pXjRf6lKNz9yJqR2EsKcHIA7tA4rS_g-/view?usp=sharing

**🔗 Live App:** wandr-kdrx1jj1p-eshikakarssts-projects.vercel.app

📂 GitHub Repo: https://github.com/eshikakarsst/wandr
---

# 🧠 Problem Statement

Travel planning today is scattered across multiple platforms. Travelers typically:

* lose track of travel budgets 💸
* forget required travel documents 📄
* struggle organizing itineraries 🗺️
* switch between multiple apps for planning

This creates confusion, inefficiency, and unnecessary stress.

The **Smart Travel Planner** solves this by providing a **single centralized platform** where users can:

* manage trip budgets
* organize itineraries
* track required travel documents
* store trip details securely

all inside one application.

---

# 👥 Target Users

This application is designed for:

* students planning trips
* solo travelers
* families planning vacations
* frequent travelers managing multiple trips

Anyone who wants a structured and stress‑free travel planning experience.

---

# ❗ Why This Problem Matters

Travel planning is often chaotic because information is spread across different tools. A centralized solution:

* saves time
* reduces planning errors
* improves travel preparedness
* creates a smoother travel experience

This project demonstrates how modern web technologies can simplify real-world planning workflows.

---

# ✨ Core Features

## 🔐 Authentication System

* User Signup
* User Login
* Logout functionality
* Protected routes
* Persistent sessions using Firebase Auth

## 📊 Dashboard

* Overview of all trips
* Quick navigation to itinerary, budget, and documents
* Personalized trip management interface

## 💸 Budget Planner

* Add expenses
* Track total spending
* Categorize expenses
* Update/Delete expenses
* Monitor remaining budget

## 🗺️ Itinerary Manager

* Add travel activities
* Organize trip schedule by day
* Update/Delete itinerary items

## 📄 Document Tracker

* Track required travel documents
* Mark documents as completed
* Update/Delete document entries

## ☁️ Cloud Storage

All user data is securely stored using **Firebase Firestore**.

---

# 🛠️ Tech Stack

## Frontend

* React (Functional Components)
* React Router
* Context API (Global State)
* Tailwind CSS

## Backend (BaaS)

* Firebase Authentication
* Firebase Firestore Database

## Performance Optimization

* useMemo
* useCallback
* Lazy Loading (React.lazy + Suspense)

---

# ⚛️ React Concepts Used

## Core Concepts

* Functional Components
* Props & Component Composition
* useState
* useEffect
* Conditional Rendering
* Lists & Keys

## Intermediate Concepts

* Lifting State Up
* Controlled Components
* React Router
* Context API

## Advanced Concepts

* useMemo
* useCallback
* useRef
* Lazy Loading
* Component Optimization

---

# 📂 Folder Structure

```
src/
 ┣ components/
 ┣ pages/
 ┣ hooks/
 ┣ context/
 ┣ services/
 ┣ utils/
 ┗ App.jsx
```

This structure ensures:

* scalability
* clean separation of concerns
* reusable components

---

# 🔐 Backend Integration

Firebase is used for:

* Authentication
* Firestore database
* Persistent user data storage
* CRUD operations

---

# 📦 CRUD Operations Implemented

Users can:

* Create trips
* Read trip details
* Update itinerary & budgets
* Delete trips/documents/expenses

All changes sync in real-time using Firestore.

---

# 🎨 UI/UX Features

* Fully responsive design
* Mobile-friendly layout
* Clean navigation structure
* Loading indicators
* Error handling messages
* Consistent component styling

---

# 🧪 Installation & Setup Guide

Follow these steps to run the project locally.

## Step 1: Clone Repository

```
git clone https://github.com/yourusername/smart-travel-planner.git
```

## Step 2: Navigate Into Folder

```
cd smart-travel-planner
```

## Step 3: Install Dependencies

```
npm install
```

## Step 4: Setup Environment Variables

Create a `.env` file in the root directory and add:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 5: Run Development Server

```
npm run dev
```

---

# 🌐 Deployment

Recommended platforms:

* Vercel
* Netlify

Steps:

```
npm run build
```

Deploy `/dist` folder.

---

# 🎥 Demo Video (Submission Requirement)

The demo video explains:

* Problem Statement
* Key Features
* Tech Stack
* Architecture decisions

Video Duration: **3–5 minutes**

---

# 📊 Evaluation Criteria Coverage

This project demonstrates:

✅ Strong React fundamentals
✅ Advanced hooks usage
✅ Firebase backend integration
✅ Authentication system
✅ CRUD operations
✅ Responsive UI/UX
✅ Clean architecture

---

# 🚀 Future Improvements

Planned enhancements:

* AI-based trip suggestions
* Travel checklist reminders
* Expense analytics dashboard
* Export trip summary as PDF

---

# 👩‍💻 Author

**Eshika Kar**
Batch 2029 – React Web Applications

---

# ⭐ Final Note

This project demonstrates how a real-world planning workflow can be simplified using modern React architecture and Firebase backend services.

It is designed as both an **academic submission** and a **portfolio-ready production-style application**.
