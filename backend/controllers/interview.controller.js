const {
  cleanQuestion,
  extractQuestion,
  getFallbackQuestion,
} = require("../utils/helpers");
const { levelRules } = require("../utils/levelRules");
const { callOpenRouter } = require("../services/openrouter.service");

/* =====================
   GENERATE QUESTION
===================== */
exports.generateQuestion = async (req, res) => {
  const { jobTitle, level, techStack, previousQA = [] } = req.body;

  try {
    const asked = previousQA.map(q => q.question.toLowerCase());

    let question = await callOpenRouter([
      {
        role: "system",
        content: `
You are a senior technical interviewer.
Never repeat a question.
${levelRules[level] || levelRules.beginner}
        `,
      },
      {
        role: "user",
        content: `
Generate ONE interview question.

Rules:
- Max 20 words
- No formatting
- No explanations
- Do NOT repeat previous questions

Role: ${jobTitle}
Level: ${level}
Tech Stack: ${techStack}

Previous Questions:
${asked.join("\n") || "None"}

Return ONLY the question.
        `,
      },
    ]);

    question = cleanQuestion(question);

    if (!question || asked.includes(question.toLowerCase())) {
      question = getFallbackQuestion(techStack, level, previousQA);
    }

    res.json({ question });
  } catch {
    res.json({
      question: getFallbackQuestion(techStack, level, previousQA),
    });
  }
};

/* =====================
   ANALYZE ANSWERS
===================== */
exports.analyzeAnswers = async (req, res) => {
  const { qa } = req.body;

  try {
    const response = await callOpenRouter([
      {
        role: "system",
        content: "You are a strict technical interview evaluator."
      },
      {
        role: "user",
        content: `
Evaluate interview.

Return STRICT JSON:

{
  "overall": "string",
  "confidenceScore": number,
  "technicalScore": number,
  "communicationScore": number,
  "perQuestion": [
    {
      "question": "",
      "userAnswer": "",
      "missing": "",
      "idealAnswer": ""
    }
  ],
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

Transcript:
${JSON.stringify(qa, null, 2)}
        `
      }
    ]);

    const parsed = JSON.parse(
      response.slice(response.indexOf("{"), response.lastIndexOf("}") + 1)
    );

    res.json({ analysis: parsed });
  } catch {
    res.json({
      analysis: {
        overall: "Feedback could not be generated.",
        confidenceScore: 0,
        technicalScore: 0,
        communicationScore: 0,
        perQuestion: [],
        strengths: [],
        weaknesses: [],
        suggestions: [],
      },
    });
  }
};
