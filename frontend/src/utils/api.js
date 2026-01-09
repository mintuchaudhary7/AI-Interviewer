const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function fetchQuestion(payload) {
  const res = await fetch(`${API_BASE}/api/generate-question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.question;
}

export async function analyzeAnswers(payload) {
  const res = await fetch(`${API_BASE}/api/analyze-answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.analysis;
}
