# 🌾 AgriVistaar — Kisan ka Sathi

> AI-powered precision agriculture platform for Indian farmers — drone analytics, crop health monitoring, mandi price signals, and yield prediction.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | Auth0 (SPA + JWT) |
| AI Assistant | Google Gemini API |
| Hosting | Antigravity |
| Drone Analysis | Custom drone inspection pipeline |

---

## ✨ Features

- 🛸 **Drone Upload & Scan** — Upload drone imagery for crop health analysis
- 🌱 **Field Management** — Add, track and manage multiple farm fields
- 📊 **AI Crop Analysis** — Detect pest, stress and disease early
- 📈 **Mandi Price Signal** — Live mandi prices with buy/sell recommendations
- 🌦️ **Weather Integration** — Real-time weather for farm planning
- 🤖 **Ask Sathi (Gemini AI)** — AI chat assistant powered by Google Gemini API for farming queries
- 🔐 **Auth0 Authentication** — Secure login, signup and social login support
- 🌐 **Multi-language** — English, Hindi, Marathi, Tamil, Bengali, Telugu

---

## 📁 Project Structure

```
farmer-drone-app/
├── backend/                  # Node.js + Express API
│   ├── config/               # DB config
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Auth middleware (Auth0 JWT)
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── scripts/              # Migration & seed scripts
│   └── server.js
│
├── farmer-drone-client/      # React frontend (Vite)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # Navbar, ChatFloat, etc.
│   │   ├── context/          # Language context
│   │   ├── pages/            # All page components
│   │   ├── api.js            # Axios instance
│   │   └── App.jsx
│   └── index.html
│
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Auth0 account
- Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/agrivistaar.git
cd agrivistaar
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `.env` file in `/backend`:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
FLASK_URL=http://localhost:6000
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier
AUTH0_CONNECTION_ID=your_connection_id
GEMINI_API_KEY=your_gemini_api_key
```

Start backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd farmer-drone-client
npm install
```

Create `.env` file in `/farmer-drone-client`:
```env
VITE_API_URL=http://localhost:5000
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
```

Start frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔐 Auth0 Configuration

1. Create a **Single Page Application** in Auth0
2. Set Allowed Callback URLs: `http://localhost:5173`
3. Set Allowed Logout URLs: `http://localhost:5173`
4. Set Allowed Web Origins: `http://localhost:5173`
5. Create an **API** with identifier `https://api.agrivistaar.com`
6. Authorize your SPA app to access the API

---

## 🤖 Gemini AI Integration

AgriVistaar uses **Google Gemini API** to power the **Ask Sathi** chat assistant. Farmers can ask questions in their local language about:
- Crop diseases and treatments
- Weather-based farming decisions
- Mandi price strategies
- General farming advice

---

## ☁️ Deployment

This project is hosted on **Antigravity**.

---

## 🗄️ Database Models

- **User** — farmer profile with Auth0 linking
- **Field** — farm field with crop details
- **DroneJob** — drone scan requests
- **DroneInspection** — scan results and AI analysis
- **AiAnalysis** — crop health AI reports

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/sync` | Sync Auth0 user to MongoDB |
| GET | `/api/fields/my` | Get user's fields |
| POST | `/api/fields` | Add new field |
| GET | `/api/drone-jobs/my` | Get user's drone jobs |
| POST | `/api/drone-jobs` | Request drone scan |
| GET | `/api/mandi/prices` | Get live mandi prices |
| POST | `/api/chat` | Ask Sathi — Gemini AI chat |

---

## 📸 Screenshots

<img width="1911" height="902" alt="image" src="https://github.com/user-attachments/assets/0faed568-f51d-4ae5-a4bc-9ad6e2206039" />
<img width="1894" height="949" alt="image" src="https://github.com/user-attachments/assets/91db07e9-85b7-4fd0-8548-217ce27c2b26" />
<img width="1906" height="902" alt="image" src="https://github.com/user-attachments/assets/5703554b-ba10-4d9c-af96-d0286e195e28" />




## 👨‍💻 Built by

**Team AgriVistaar** — ABES IT, Ghaziabad

| Name | Role |
|---|---|
| Saina Sharma | MERN Stack Developer |
| Kartike Rohila | MERN Stack Developer and AI Model |
| Rishika Garg | AI Model |
| Kanav Agarwal | Backend Developer |

Built with ❤️ for Indian farmers 🌾
