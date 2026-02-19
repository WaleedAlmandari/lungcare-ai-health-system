# 🫁 LungCare AI Health System

LungCare is a full-stack AI-powered respiratory healthcare platform designed to support early detection, risk assessment, and health awareness using Machine Learning and Deep Learning models.

The system integrates multiple intelligent diagnostic tools into one unified healthcare ecosystem.

---

## 🚀 Project Overview

LungCare combines Computer Vision, Audio Classification, and Predictive Modeling to analyze respiratory health risks.

The platform provides:

- 🩻 Pneumonia Detection from Chest X-rays (CNN Model)
- 🧬 Lung Cancer Image Classification (Deep Learning - Keras)
- 📊 Lung Cancer Risk Prediction (Random Forest Classifier)
- 🎙️ Cough Sound Analyzer (Audio Classification)
- 🤖 AI Symptom Checker
- 🌫️ Air Quality Risk Assessment Tool

This project demonstrates real-world deployment of AI models through a modern web application architecture.

---

## 🏗 System Architecture

Frontend (React.js)  
⬇  
Backend API (Flask)  
⬇  
Machine Learning & Deep Learning Models  

Technologies Used:

- React.js
- Flask
- TensorFlow / Keras
- Scikit-learn
- CNN (Image Classification)
- Random Forest
- Audio Processing
- Tailwind CSS

---

## 📂 Project Structure

lungcare-ai-health-system/
│
├── flask_app/ # Backend (Flask API + AI models)
├── src/ # React frontend source code
├── public/ # Static frontend files
├── package.json
├── .gitignore
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository


git clone https://github.com/WaleedAlmandari/lungcare-ai-health-system.git
cd lungcare-ai-health-system
2️⃣ Backend Setup (Flask)
cd flask_app
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt
Create a .env file inside flask_app/:

OPENAI_API_KEY=your_key_here
OPEN_WEATHER_KEY=your_key_here
Run backend:

python app.py
Backend runs on:

http://127.0.0.1:5000
3️⃣ Frontend Setup (React)
From the root directory:

npm install
npm start
Frontend runs on:

http://localhost:3000
🔐 Security
API keys are securely managed using environment variables.

Sensitive files are excluded via .gitignore.

No secrets are stored in the repository.

🎯 Key Highlights
Multi-model AI integration

Computer Vision + Audio AI

Full-stack architecture

Healthcare-focused impact

Real-world deployment design

👨‍💻 Developed By
Waleed Almandari
Artificial Intelligence Graduate
Focused on Machine Learning & AI System Deployment

📜 Disclaimer
This system is designed for educational and awareness purposes only and does not replace professional medical diagnosis.

