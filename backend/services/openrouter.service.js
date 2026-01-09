const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function callOpenRouter(messages) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat",
      messages,
      temperature: 0.6,
    }),
  });

  if (!res.ok) throw new Error(`OpenRouter API error: ${res.statusText}`);

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

module.exports = { callOpenRouter };
