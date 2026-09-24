# MediPlain — AI-Powered Healthcare Information Platform

MediPlain is a full-stack healthcare technology prototype designed to make
complex medical information easier to understand.

The platform allows users to work with medical prescriptions, laboratory
reports, medical tests, medicines, diseases, and billing information through
OCR, structured data, generative AI, multilingual interfaces, and voice
interaction.

> **Project Type:** Full-Stack Healthcare Technology Prototype  
> **Focus:** Healthcare AI • OCR • Software Engineering • APIs • Data • Multilingual UX

---

## Why I Built MediPlain

Medical documents often contain terminology and information that can be
difficult for non-technical users to understand.

MediPlain explores how software engineering, OCR, structured healthcare
information, and generative AI can be combined to make medical information
more accessible and easier to understand.

Building the platform also provided hands-on experience with authentication,
API security, data management, OCR pipelines, AI integration, multilingual
interfaces, and the challenges of handling AI-generated information in a
healthcare context.

> **Note:** MediPlain is an educational/project prototype and is not intended
> to provide medical diagnosis or treatment. AI-generated information should
> not be considered a substitute for advice from qualified healthcare
> professionals.

---

## Key Capabilities

### 1. Medical Document OCR

Users can upload medical documents such as:

- Prescriptions
- Laboratory reports
- Medical bills

The backend uses **Tesseract.js** to extract text from uploaded documents,
which can then be processed by the application's information and AI
workflow.

---

### 2. AI-Assisted Medical Information

MediPlain integrates the **Google Gemini API** to generate simplified
explanations from extracted medical information.

The application can present information such as:

- Meaning of medical terms
- General purpose of medicines and medical tests
- Explanations of report information
- Relevant warnings and precautions
- Simplified descriptions of complex medical information

AI-generated responses are presented as informational assistance and are not
intended to replace professional medical advice.

---

### 3. Multilingual Support

The application supports:

- English
- Hindi
- Telugu

Language preferences can be applied throughout the application interface and
supported information.

The project stores multilingual information directly within the application's
data layer rather than relying entirely on browser translation.

---

### 4. Voice Search

MediPlain supports browser-based speech recognition so users can search using
their voice.

Voice input is supported for the application's supported languages where
browser speech-recognition capabilities are available.

---

### 5. Text-to-Speech

Users can listen to supported information through browser-based
Text-to-Speech (TTS).

This provides an additional accessibility option for users who prefer
audio-based interaction.

---

### 6. Healthcare Information Management

The backend maintains structured data for areas such as:

- Medicines
- Medical tests
- Diseases
- User reports
- Users
- Administrative data

**MongoDB Atlas** is used as the primary database.

---

### 7. Authentication and Access Control

The application implements:

- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- Role-based administrative access
- Authentication middleware

The backend also includes security middleware and request protection
mechanisms.

---

### 8. Administrative Console

An administrative interface allows authorized administrators to:

- Manage medicines
- Manage medical tests
- Manage diseases
- Manage registered users
- View application statistics
- Perform CRUD operations
- Import structured JSON data

---

## Engineering Challenges

Building MediPlain involved solving several practical software engineering
problems:

- Processing unstructured medical documents using OCR
- Integrating generative AI into a full-stack application
- Managing structured healthcare-related data using MongoDB
- Designing authenticated REST APIs
- Implementing role-based administrative access
- Supporting multilingual information and search
- Handling voice-based user interaction
- Considering security and responsible use of AI-generated information

These challenges provided hands-on experience at the intersection of
**healthcare, software engineering, artificial intelligence, and
accessibility**.

---

# System Architecture

'''text

                         USER
                           │
                           ▼
              ┌─────────────────────────┐
              │     React Frontend      │
              │   TypeScript + Vite     │
              └────────────┬────────────┘
                           │
                       REST APIs
                           │
                           ▼
              ┌─────────────────────────┐
              │   Node.js + Express     │
              │       Backend           │
              └────────────┬────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
      ┌──────────┐   ┌────────────┐  ┌────────────┐
      │ Tesseract│   │ Gemini API │  │  MongoDB   │
      │   OCR    │   │ AI Layer   │  │   Atlas    │
      └──────────┘   └────────────┘  └────────────┘
            │              │              │
            └──────────────┼──────────────┘
                           │
                           ▼
                 Simplified Information

## Technical Stack
Frontend
Framework: React with Vite & TypeScript
Styling: Tailwind CSS
Routing: React Router v6
Forms: React Hook Form
API Client: Axios
Icons: Lucide Icons
Animations: Framer Motion
Backend
Runtime: Node.js with Express & TypeScript
Database: MongoDB Atlas with Mongoose
Security: Helmet, CORS, Express Rate Limiter, bcryptjs
OCR: Tesseract.js
Generative AI: Google Gemini API (@google/generative-ai)
Authentication: JSON Web Tokens (JWT)


MEDIPLAN/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── Database configuration
│   │   │
│   │   ├── controllers/
│   │   │   ├── Authentication
│   │   │   ├── Admin
│   │   │   ├── Search
│   │   │   ├── Reports
│   │   │   └── Medicines
│   │   │
│   │   ├── middlewares/
│   │   │   ├── JWT authentication
│   │   │   ├── Admin authorization
│   │   │   ├── Rate limiting
│   │   │   ├── CORS
│   │   │   └── Global error handling
│   │   │
│   │   ├── models/
│   │   │   ├── User
│   │   │   ├── Admin
│   │   │   ├── Medicine
│   │   │   ├── MedicalTest
│   │   │   ├── Disease
│   │   │   └── Report
│   │   │
│   │   ├── routes/
│   │   │   └── REST API routes
│   │   │
│   │   ├── services/
│   │   │   ├── OCR processing
│   │   │   └── Gemini AI integration
│   │   │
│   │   └── seed/
│   │       └── Database seed data
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md


Security Considerations

Security was considered across the application's authentication and API
layers.

Current implementation includes:

JWT-based authentication
Password hashing using bcrypt
Protected backend routes
Administrative authorization
Helmet security middleware
CORS configuration
Request rate limiting
Centralized error handling

Healthcare applications require additional security, privacy, compliance, and
data-governance controls before being considered for production deployment.

MediPlain is therefore presented as a prototype for exploring healthcare
technology and software engineering concepts, rather than as a
production-certified healthcare system.

Backend Setup
Prerequisites

Make sure the following are installed:

Node.js
npm
MongoDB Atlas account
Google Gemini API key
Git
1. Clone the Repository
git clone https://github.com/Chitla-Sathwika/MEDIPLAN.git
cd MEDIPLAN
2. Backend Configuration

Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file containing the required environment variables:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

Never commit API keys, passwords, or .env files to GitHub.

Seed the database with the available sample data:

npm run seed

Start the backend development server:

npm run dev
Frontend Setup

Open another terminal and navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the Vite development server:

npm run dev

Open the local application using the URL displayed by Vite.
