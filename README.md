# AI Resume Analyzer — Full MERN Stack

## Stack
- **Frontend**: React 18 + Vite + Tailwind CSS (light, professional UI)
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **AI**: Google Gemini 1.5 Flash (free tier)
- **Auth**: JWT + bcryptjs

---

## Features
- Animated circular match score ring
- Real AI skill analysis (Gemini API)
- PDF resume upload with drag-and-drop
- Download analysis as PDF report
- History with delete + score trends
- Profile page with career stats + score distribution
- Protected routes (JWT auth guard)
- Mobile responsive

---

## Setup (5 steps)

### Step 1 — Get free Gemini API key
👉 https://aistudio.google.com/app/apikey

### Step 2 — Backend
```bash
cd "AI Resume Analyzer/backend"
npm install
```

Open `.env` and set:
```
MONGO_URI=mongodb://localhost:27017/ResumeAnalyzer
PORT=8000
JWT_SECRET=any_long_random_string_here
GEMINI_API_KEY=paste_your_key_here
```

Start backend:
```bash
npm run dev
```

### Step 3 — Frontend
```bash
cd "AI Resume Analyzer/frontend"
npm install
npm run dev
```

### Step 4 — Make sure MongoDB is running
```bash
# If installed locally:
mongod
# OR use MongoDB Atlas — paste your Atlas URI in .env MONGO_URI
```

### Step 5 — Open
http://localhost:5173

---

## Project Structure
```
AI Resume Analyzer/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── AnalysisController.js   ← Real Gemini AI here
│   │   └── historyControllers.js
│   ├── middleware/authMiddleware.js
│   ├── models/
│   │   ├── user.js
│   │   └── Analysis.js
│   ├── routes/
│   │   ├── AuthRoutes.js
│   │   ├── analysisRoutes.js
│   │   └── historyRoutes.js
│   ├── utils/generateToken.js
│   ├── uploads/              ← PDFs stored here
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Home.jsx          ← Hero + Features + How it works
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx     ← Drag-drop upload + animated button
    │   │   ├── Analysis.jsx      ← Animated score ring + PDF download
    │   │   ├── History.jsx       ← Table + stats cards + delete
    │   │   └── Profile.jsx       ← Avatar + score distribution
    │   ├── App.jsx               ← Protected routes
    │   ├── main.jsx
    │   └── index.css             ← All animations + utilities
    ├── index.html
    ├── vite.config.js            ← Proxy: /api → :8000
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json

---

## API Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login |
| POST | /api/analyze | Yes | Analyze resume PDF |
| GET | /api/history | Yes | Get all analyses |
| DELETE | /api/history/:id | Yes | Delete an analysis |
| GET | /api/health | No | Health check |
