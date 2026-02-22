# Luminary AI v3.0 Alpha 🚀

> **Unleash Your Full Potential.** Master your communication with biometric composure analysis, semantic sentiment mapping, and high-fidelity ML scoring.

Luminary AI is a cutting-edge, full-stack platform designed to help candidates refine their interview skills using advanced AI and audio biometrics. By analyzing vocal patterns, facial expressions, and linguistic sentiment, it provides a comprehensive 360-degree view of your performance.

---

## ✨ Key Features

- **🎭 Visual & Vocal Biometrics**: Tracks pitch variation, energy stability, and facial emotions (via OpenCv/FER).
- **🗣️ Neural Transcription**: High-accuracy speech-to-text powered by Google Speech Recognition.
- **🛡️ Linguistic Precision**: Detects filler words (um, uh, like, etc.) and analyzes speaking pace (WPM).
- **🧠 Gemini AI Feedback**: Receives deep, context-aware suggestions for improvement from Google's Gemini Flash model.
- **📊 Diagnostic Dashboard**: Beautifully visualized metrics using Recharts and Framer Motion for a cinematic experience.
- **⚡ Quantum Feedback**: Micro-second latency scoring with predictive ML modeling.

---

## 🛠️ Tech Stack

### Frontend 💻
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS with Glassmorphism
- **Animations**: Framer Motion
- **Icons**: Lucide-React
- **Charts**: Recharts
- **Auth**: Firebase Authentication

### Backend ⚙️
- **Server**: Python Flask
- **Audio Processing**: Librosa, SpeechRecognition
- **NLP**: NLTK, TextBlob, Gemini AI
- **ML**: Scikit-learn (Joblib for model loading)
- **Computer Vision**: OpenCV, FER (Fer-python)

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Harshithpalan/AI-Interview-Analyzer-.git
cd AI-Interview-Analyzer-
```

### 2️⃣ Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Wait for the server to start on `http://localhost:5000`.*

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 📂 Project Structure

```bash
AI-Interview-Analyzer/
├── backend/            # Flask API & NLP Logic
│   ├── analyzer.py     # Core analysis engine
│   ├── app.py          # API Endpoints
│   └── models/         # Pre-trained ML models
├── frontend/           # React Application
│   ├── src/            # UI Components & Context
│   └── public/         # Static assets
└── assets/             # Project branding & screenshots
```

---

## 📈 Performance Metrics

The analyzer evaluates your performance across four key dimensions:
1. **Filler Words (30%)**: Measures clarity and conciseness.
2. **Speaking Speed (30%)**: Ensures optimal pacing for engagement.
3. **Voice Confidence (30%)**: Analyzes vocal range and stability.
4. **Sentiment & Tone (10%)**: Evaluates the emotional impact of your response.

---