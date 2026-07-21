# MediPlain: AI-Powered Medical Report, Medicine & Health Information Platform

MediPlain is a production-quality healthcare web application designed to translate complex medical prescriptions, billing items, laboratory panels, and diagnostic terms into clear, simple language suitable for patients. It supports full multilingual layouts, native Speech Recognition (Voice Search), browser-synthesized Text-to-Speech (TTS) audio, Optical Character Recognition (OCR), and generative AI medical report explanations.

---

## Technical Stack

### Frontend
- **Framework:** React with Vite & TypeScript
- **Styling:** Tailwind CSS (featuring dark-mode support and custom premium animations)
- **Routing:** React Router v6
- **Forms:** React Hook Form
- **API Client:** Axios (configured with auth token and session handlers)
- **Icons:** Lucide Icons
- **Transitions:** Framer Motion

### Backend
- **Runtime:** Node.js with Express & TypeScript
- **Database:** MongoDB Atlas with Mongoose
- **Security:** Helmet, CORS, Express Rate Limiter, and BCryptjs password hashing
- **OCR Engine:** Tesseract.js
- **Generative AI:** Google Gemini API (`@google/generative-ai`)
- **Session Management:** JSON Web Token (JWT)

---

## Directory Architecture

```
mediplain/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Authentication, Admin console, Search, Report and Medicines controller handlers
│   │   ├── middlewares/     # JWT Auth guard, admin privilege checks, Rate limiter, CORS, Global error handlers
│   │   ├── models/          # Mongoose Schemas (User, Admin, Medicine, MedicalTest, Disease, Report, etc.)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Tesseract OCR scanners and Gemini AI prompts
│   │   └── seed/            # Seed data JSON and TS script
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Glassmorphic Navbar, Footer, and Notification lists
│   │   ├── contexts/        # Auth (sessions), Language (UI translates), and Theme contexts
│   │   ├── hooks/           # useSpeech (browser Text-to-Speech audio reader)
│   │   ├── layouts/         # Default, Auth, and Admin console layouts
│   │   ├── pages/           # Search details, OCR, History, Bookmarks, and Profile screens
│   │   └── services/        # Axios client interceptors
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```

---

## Key Features

1. **Multilingual Language Controls:** Syncs the entire application layouts, searches, and data items to English, Hindi, or Telugu natively (no Google Translate API needed; translations are stored and queried directly from MongoDB).
2. **Native Voice Search (Speech Recognition):** Let users click the microphone icon to dictate search queries in English, Hindi, or Telugu.
3. **OCR Upload & AI Explanation:** User uploads prescription images, lab panels, or clinical bills. The backend processes the text via Tesseract OCR, matches keywords, queries Gemini AI to summarize it in simple language (meaning, purpose, warnings, abnormal values, lifestyle advice), and saves the parsed report.
4. **Text-to-Speech (TTS):** Allows users to listen to AI explanations and drug specifications spoken aloud in their native tongue.
5. **Secure Admin Desk Console:** Administrators can check statistics, run CRUD panels for Medicines, Medical Tests, and Diseases, manage patient users, and drop-in bulk JSON database imports on the fly.

---

## Local Setup & Configuration

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local instance running on `127.0.0.1:27017` or a MongoDB Atlas URI)

### Backend Configuration
1. Navigate to the `backend` directory.
2. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/mediplain
   JWT_SECRET=super_secret_mediplain_dev_key_12345
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=development
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed the database with multilingual sample data (Medicines, Tests, Diseases, and Default Accounts):
   ```bash
   npm run seed
   ```
   *Note:* Seeding creates a default user account (`user@mediplain.com` / `user123`) and an admin account (`admin@mediplain.com` / `admin123`).
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Configuration
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---

## Verification & Walkthroughs

A detailed description of code files and implementation walkthroughs is located in the [walkthrough.md](file:///C:/Users/sathw/.gemini/antigravity/brain/78a2a588-6c05-49e3-9fe8-cf9213b84ffe/walkthrough.md) artifact, located inside the workspace conversation brain directory.
