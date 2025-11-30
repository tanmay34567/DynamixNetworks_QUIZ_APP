# DynamixNetworks — Learning Management System (LMS)

<div align="center">

![LMS](https://img.shields.io/badge/LMS-System-blue) ![React](https://img.shields.io/badge/React-18+-61dafb?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-13aa52?logo=mongodb) ![License](https://img.shields.io/badge/License-MIT-green)

A modern, full‑stack learning management system built with React, TypeScript, Node.js, and MongoDB.

</div>

---

## 🚀 Overview

DynamixNetworks LMS is a lightweight, production‑ready learning management system that supports role‑based access (students & teachers), course management, enrollment tracking, and progress reporting. It's ideal for demos, classroom pilots, or as a starter template for larger education platforms.

## ✨ Highlights

* Role-based authentication (student / teacher)
* Course creation and module/quiz structure
* Enrollment and per‑module progress tracking
* Responsive UI built with Tailwind CSS and Vite
* RESTful API with Express and MongoDB (Mongoose)
* Simple seed/demo accounts for quick testing

---

## 🧭 Tech Stack

**Frontend**

* React 18+, TypeScript, Vite
* Tailwind CSS, Lucide icons
* Recharts for visualizations
* React Context API for global state

**Backend**

* Node.js, Express
* MongoDB + Mongoose
* JWT or token based authentication

---

## 📁 Project Layout

```
DynamixNetworks_LMS/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── models/
│       ├── User.js
│       ├── Course.js
│       └── Enrollment.js
├── frontend/
│   ├── src/
│   │   ├── index.tsx
│   │   ├── App.tsx
│   │   ├── types.ts
│   │   ├── components/
│   │   └── pages/
│   └── package.json
└── README.md
```

---

## 🔧 Prerequisites

* Node.js v18+ and npm v9+
* MongoDB (local or Atlas)

---

## ⚙️ Local Setup

### Backend

```bash
cd backend
npm install
# create .env (optional)
# MONGO_URI=mongodb://localhost:27017/dynamixlms
# PORT=5000
npm run dev
```

API base: `http://localhost:5000/api`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

---

## 🧭 Quick Start (Both Services)

**Terminal 1**

```bash
cd backend
npm install
npm run dev
```

**Terminal 2**

```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints (summary)

**Auth**

* `POST /api/auth/register` — register
* `POST /api/auth/login` — login
* `GET /api/auth/profile` — get profile (auth)

**Courses**

* `GET /api/courses` — list
* `GET /api/courses/:id` — details
* `POST /api/courses` — create (teacher)
* `PUT /api/courses/:id` — update (teacher)
* `DELETE /api/courses/:id` — delete (teacher)

**Enrollments**

* `GET /api/enrollments` — user enrollments
* `POST /api/enrollments` — enroll
* `PUT /api/enrollments/progress` — update progress
* `DELETE /api/enrollments/:id` — unenroll

---

## 👥 Demo Accounts

Use these seeded accounts for testing:

| Role    | Email              | Password   |
| ------- | ------------------ | ---------- |
| Student | `student@demo.com` | `password` |
| Teacher | `teacher@demo.com` | `password` |

> If seeding fails, clear `localStorage` and restart the backend to re-run the seeder.

---

## 🗂️ Database Models (overview)

**User**: `_id, email, password (hashed), fullName, role, createdAt`

**Course**: `_id, title, description, instructor(ObjectId), modules[], createdAt`

**Enrollment**: `_id, userId, courseId, progress[], enrolledAt`

---

## 🔐 Security & Best Practices

* Store passwords hashed (bcrypt)
* Protect teacher routes with role checks
* Issue JWTs (or session tokens) and validate on protected routes
* Sanitize and validate incoming payloads (use a validation library)

---

## 🛠️ Scripts

**Backend**

* `npm start` — run server
* `npm run dev` — run server with nodemon

**Frontend**

* `npm run dev` — Vite dev server
* `npm run build` — production build
* `npm run preview` — preview production build

---

## 🤝 Contributing

Contributions welcome — please follow:

1. Fork
2. Create feature branch
3. Commit & push
4. Open PR

Write clear PR descriptions, add tests for critical logic, and follow the code style.

---

## 🧪 Troubleshooting

* If frontend can't load data: ensure backend is running and `API_URL` is correct in `frontend/context/Store.tsx`.
* If DB errors: verify `MONGO_URI` and that MongoDB is running.


---

## 👤 Author

**DynamixNetworks** — [@tanmay34567](https://github.com/tanmay34567)

---

If you want, I can also:

* create a short `CONTRIBUTING.md` or `ISSUE_TEMPLATE.md`
* generate a concise `CHANGELOG.md`
* produce a `Dockerfile`/`docker-compose.yml` for easier local setup

Tell me which one to add next.
