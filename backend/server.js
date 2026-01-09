require("dotenv").config();
const express = require("express");
const cors = require("cors");

const interviewRoutes = require("./routes/interview.routes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 5000;

app.use("/api", interviewRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
