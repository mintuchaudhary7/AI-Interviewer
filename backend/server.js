require("dotenv").config();
const express = require("express");
const cors = require("cors");

const interviewRoutes = require("./routes/interview.routes");

const app = express();

/**
 * CORS configuration
 * - Allow Vercel frontend
 * - Allow local development
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local Vite
      "http://localhost:3000",
      process.env.FRONTEND_URL, // Vercel URL (set in Render env)
    ].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 5000;

/**
 * API routes
 */
app.use("/api", interviewRoutes);

/**
 * Health check / root route
 */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "AI Interviewer Backend is running 🚀",
  });
});

/**
 * Fallback for unknown routes
 */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
