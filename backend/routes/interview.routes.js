const express = require("express");
const router = express.Router();
const {
  generateQuestion,
  analyzeAnswers,
} = require("../controllers/interview.controller");

router.post("/generate-question", generateQuestion);
router.post("/analyze-answers", analyzeAnswers);

module.exports = router;
