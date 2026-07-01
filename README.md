# 🌾 AgriVistaar — Kisan ka Sathi

> **AI-powered Precision Agriculture Platform for Indian Farmers**

AgriVistaar is a full-stack MERN application designed to empower farmers with intelligent farming solutions. The platform combines AI-driven crop analysis, drone-assisted field monitoring, live mandi price insights, multilingual support, and secure authentication to help farmers make informed decisions and improve agricultural productivity.

> 🚧 **Project Status:** Actively under development. New features and improvements are being added continuously.

---

## 🌐 Live Demo

🚧 Deployment in progress.

---

## ✨ Key Features

- 🛸 **Drone-Based Crop Monitoring**
  - Upload drone imagery for crop inspection and health analysis.

- 🌱 **Field Management**
  - Create and manage multiple farm fields with crop details.

- 🤖 **AI Crop Analysis**
  - Detect crop stress, pests, and diseases using AI.

- 📈 **Live Mandi Price Intelligence**
  - View mandi prices and receive buy/sell recommendations.

- 🌦️ **Weather Insights**
  - Real-time weather updates for better farming decisions.

- 💬 **Ask Sathi (Gemini AI)**
  - AI farming assistant supporting multiple regional languages.

- 🔐 **Secure Authentication**
  - Login and user management powered by Auth0.

- 🌍 **Multi-language Support**
  - English
  - Hindi
  - Marathi
  - Tamil
  - Telugu
  - Bengali

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React (Vite), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | Auth0 |
| AI | Google Gemini API |
| Machine Learning | Python, Scikit-Learn |
| Hosting | Antigravity |

---

## 🏗️ System Architecture

The diagram below illustrates the overall architecture and data flow of AgriVistaar.

```mermaid
flowchart LR

A[Farmer]
B[React Frontend]
C[Firebase Auth]
D[Node Express Backend]
E[Drone Scan Module]
F[Crop Health AI]
G[Fraud Detection]
H[Gemini AI]
I[Market Intelligence]
J[Government Schemes]
K[Farmer Dashboard]

A --> B
B --> C
B --> D

D --> E
D --> F
D --> G
D --> H
D --> I
D --> J

F --> K
G --> K
H --> K
I --> K
J --> K

K --> B
B --> A
```

## 📸 Screenshots

### 🌾 Landing Page
![Landing Page](01-landing-page.png)

### 🔐 Secure Authentication
![Authentication](02-authentication-login.png)

### 📊 Farmer Dashboard
![Dashboard](03-farmer-dashboard.png)

### 📈 Farm Overview & Market Intelligence
![Overview](04-dashboard-overview.png)

### 🚁 Drone Scan Request
![Drone Scan](05-drone-scan-request.png)

### 🌱 Field Details & Scan History
![Field Details](06-field-details.png)

### 🤖 AI Crop Health & Fraud Analysis
![AI Report](07-ai-crop-health-report.png)

### 🌐 Multilingual AI Assistant
![AI Assistant](08-multilingual-ai-assistant.png)

### 🏛️ Government Schemes Center
![Schemes](09-government-schemes-center.png)

## 🚀 Core Modules

- Farmer Dashboard
- Drone Inspection
- Crop Health Monitoring
- AI Chat Assistant
- Field Management
- Live Mandi Analytics
- Weather Monitoring
- Authentication & User Profiles

---

## 💡 Why AgriVistaar?

AgriVistaar bridges the gap between modern agricultural technology and everyday farming by integrating AI, drone analytics, and real-time market intelligence into a single platform. It enables farmers to make smarter decisions, improve crop productivity, and maximize profitability through accessible, technology-driven solutions.

---

## 📌 Current Development

The project is actively evolving with upcoming enhancements including:

- 📱 Progressive Web App (PWA)
- 📊 Advanced analytics dashboard
- 📍 GPS-based field visualization
- 🚁 Enhanced drone inspection workflows
- 📈 Improved predictive farming insights

---

## 👨‍💻 Team

**Team AgriVistaar**  
ABES Institute of Technology, Ghaziabad

| Name | Role |
|------|------|
| **Saina Sharma** | MERN Stack Developer |
| **Kartike Rohila** | MERN Stack Developer & AI Engineer |
| **Rishika Garg** | AI/ML Developer |
| **Kanav Agarwal** | Backend Developer |

---

## 📌 Note

This repository represents the ongoing development of AgriVistaar. While the project is publicly available, several features are still under active development and continuous improvement.

---

Built with ❤️ to empower Indian farmers through technology.
