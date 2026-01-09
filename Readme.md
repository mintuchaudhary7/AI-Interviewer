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
  - If the user says *“I don’t know”* or gives weak answers:
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

