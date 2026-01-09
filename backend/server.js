require("dotenv").config();
const express = require("express");
const cors = require("cors");

const interviewRoutes = require("./routes/interview.routes");

const app = express();

// -------------------------------
// Middleware
// -------------------------------

// JSON parser
app.use(express.json({ limit: "1mb" }));

// Request logging (debugging origins)
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url} | Origin: ${req.headers.origin}`);
  next();
});

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite local dev
      "http://localhost:3000", // alternate local dev
      process.env.FRONTEND_URL, // Vercel production frontend
    ].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// -------------------------------
// Routes
// -------------------------------

// API routes
app.use("/api", interviewRoutes);

// Root / health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "AI Interviewer Backend is running 🚀",
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// -------------------------------
// Error handling
// -------------------------------

app.use((err, req, res, next) => {
  console.error("[Server Error]", err);
  res.status(500).json({ error: "Internal server error" });
});

// -------------------------------
// Start server
// -------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
