# Persona.ai — AI-Powered Interview & Speech Training Lab

Persona.ai is a professional-grade React application designed to help developers and public speakers master their communication skills. By leveraging real-time speech-to-text and a custom Heuristic Scoring Engine, it provides instant, actionable feedback on technical depth, structural clarity, and confidence markers.

## 🚀 Key Features

- **Acoustic Training Lab**: Real-time Speech-to-Text (STT) capture to track words and detect filler word density (ums, likes, actually).
- **AI Interview Simulator**: A multi-step mock interview mode where the AI "speaks" questions (Text-to-Speech) and waits for user responses.
- **Custom Question Portal**: Users can input specific topics or custom interview questions for personalized training.
- **Heuristic Scoring Engine**: A sophisticated internal logic system that evaluates responses based on:
  - **Structural Signifiers**: Detecting STAR method patterns (Situation, Task, Action, Result).
  - **Technical Lexicon**: Identifying industry-specific keywords (React, Hooks, State, etc.).
  - **Confidence Markers**: Penalizing "weak phrases" and hedge words.
- **Cloud History & Sync**: Full integration with Firebase for saving and reviewing past sessions.
- **High-Contrast "Aesthetic" UI**: A modern, dark-themed dashboard with glassmorphism and high-visibility branding.

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Styling**: Tailwind CSS (with Glassmorphism)
- **Backend/Database**: Firebase (Firestore)
- **Authentication**: Firebase Auth (Google Sign-In)
- **Speech Engines**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **Heuristic Engine**: Custom JavaScript Semantic Analysis

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aswinwizard81/ENDTERM-PROJECT-REACT-PersonaAi
   cd ai-persona
