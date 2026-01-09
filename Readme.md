# 🎤 AI Interviewer

An **AI-powered mock interview platform** that simulates real interview experiences using voice interaction, adaptive questioning, and structured feedback.

This project helps candidates **practice interviews**, improve communication, and identify knowledge gaps — all in a realistic, conversational flow.

---

## 🚀 Features

- 🧠 **AI-Generated Interview Questions**

  - Dynamic questions based on:
    - Job role
    - Experience level
    - Tech stack
  - Avoids repetition and adapts difficulty

- 🎙️ **Voice-Based Interaction**

  - Questions are spoken aloud
  - Answers captured via browser speech recognition
  - Hands-free interview experience

- 🔄 **Smart Follow-Up Logic**

  - If the user says _“I don’t know”_ or gives weak answers:
    - AI asks simpler or follow-up questions
    - Prevents repeating the same question endlessly

- 📜 **Live Interview Transcript**

  - Past questions and answers displayed **below the current question**
  - Ordered from **most recent to oldest**
  - Helps users track their progress in real time

- 📊 **Structured AI Feedback**
  - Overall performance summary
  - Strengths & weaknesses
  - Actionable improvement suggestions
  - Per-question feedback with ideal answers

---

## 🛠️ Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- Web Speech API (Speech-to-Text & Text-to-Speech)

### Backend

- Node.js
- Express.js
- OpenRouter AI (DeepSeek model)
- REST APIs

---

## 📂 Project Structure

AI-Interviewer:
README.md
.gitignore

frontend:
package.json
vite.config.js
tailwind.config.js
postcss.config.js
index.html
src:
main.jsx
App.jsx
assets:
components:
Interview:
QuestionCard.jsx
TranscriptPanel.jsx
FeedbackPanel.jsx
UI:
Button.jsx
Loader.jsx
hooks:
useSpeechRecognition.js
useTextToSpeech.js
services:
api.js
styles:
index.css

backend:
package.json
server.js
.env
routes:
interview.routes.js
controllers:
interview.controller.js
services:
ai.service.js
utils:
promptBuilder.js
responseParser.js

---

## ▶️ Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/mintuchaudhary7/AI-Interviewer.git
cd AI-Interviewer

## Backend Setup
cd backend
npm install
npm run dev

#Create a .env file inside /Backend
OPENROUTER_API_KEY=your_api_key_here

##Frontend Setup

cd frontend
npm install
npm run dev


App open at
http://localhost:5173


```
