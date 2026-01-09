const fallbackQuestions = require("./fallbackQuestions");

// Clean AI question
module.exports.cleanQuestion = (text = "") =>
  text
    .replace(/\*/g, "")
    .replace(/^question\s*[:\-]*/i, "")
    .replace(/^[\-\•]\s*/, "")
    .replace(/\n/g, " ")
    .trim();

// Extract question safely
module.exports.extractQuestion = (item) =>
  (item?.question || item?.q || "").trim();

// Pick fallback question
module.exports.getFallbackQuestion = (
  stack = "",
  level = "beginner",
  previousQA = []
) => {
  stack = stack.toLowerCase();
  level = level.toLowerCase();

  let pool = fallbackQuestions.backend[level] || [];

  if (stack.includes("react")) pool = fallbackQuestions.react[level] || [];
  if (stack.includes("js")) pool = fallbackQuestions.javascript[level] || [];

  const used = new Set(
    previousQA.map(extractQuestion).map((q) => q.toLowerCase())
  );

  const available = pool.filter((q) => !used.has(q.toLowerCase()));

  return available.length
    ? available[Math.floor(Math.random() * available.length)]
    : pool[Math.floor(Math.random() * pool.length)];
};
