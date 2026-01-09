const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://ai-interviewer-kngb.onrender.com";

/**
 * Generate next interview question
 */
export async function fetchQuestion(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/generate-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch question (${res.status})`);
    }

    const data = await res.json();
    return data.question;
  } catch (err) {
    console.error("fetchQuestion error:", err);
    return "Tell me about yourself.";
  }
}

/**
 * Analyze interview answers
 */
export async function analyzeAnswers(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/analyze-answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to analyze answers (${res.status})`);
    }

    const data = await res.json();
    return data.analysis;
  } catch (err) {
    console.error("analyzeAnswers error:", err);
    return {
      strengths: [],
      weaknesses: [],
      suggestions: [],
      overall: "Feedback could not be generated. Please try again.",
    };
  }
}
