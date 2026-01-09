import React, { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Interview() {
  const [jobTitle, setJobTitle] = useState("Frontend Developer");
  const [level, setLevel] = useState("mid");
  const [techStack, setTechStack] = useState("React, JavaScript");
  const [phase, setPhase] = useState("form");
  const [question, setQuestion] = useState("");
  const [qa, setQa] = useState([]);
  const [listening, setListening] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;
  }, []);

  function speak(text, onend) {
    if (!synthRef.current) return onend && onend();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.onend = onend;
    synthRef.current.cancel();
    synthRef.current.speak(utter);
  }

  function listenOnce() {
    return new Promise((resolve, reject) => {
      const rec = recognitionRef.current;
      if (!rec) return reject("SpeechRecognition not supported.");

      rec.onstart = () => setListening(true);
      rec.onend = () => setListening(false);
      rec.onerror = () => resolve("");

      rec.onresult = (e) => resolve(e.results[0][0].transcript);
      rec.start();

      setTimeout(() => {
        try {
          rec.stop();
        } catch {}
        resolve("");
      }, 10000);
    });
  }

  async function fetchQuestion() {
    const res = await fetch(`${API_BASE}/api/generate-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, level, techStack, previousQA: qa }),
    });
    const data = await res.json();
    return data.question;
  }

  async function analyzeAnswers() {
    const res = await fetch(`${API_BASE}/api/analyze-answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, level, techStack, qa }),
    });
    const data = await res.json();
    return data.analysis;
  }

  async function startInterview() {
    setPhase("interviewing");
    setQa([]);
    setAnalysis(null);

    const TOTAL = 5;

    for (let i = 0; i < TOTAL; i++) {
      const q = await fetchQuestion();
      setQuestion(q);

      await new Promise((r) => speak(q, r));
      await new Promise((r) => setTimeout(r, 300));

      let answer = await listenOnce();
      if (!answer && !recognitionRef.current) {
        answer = window.prompt(`Type your answer for: ${q}`) || "";
      }

      setQa((prev) => [...prev, { q, a: answer }]);
    }

    // ---------- FIXED PART START ----------
    setPhase("processing");

    let analysisData;
    try {
      analysisData = await analyzeAnswers();
    } catch (e) {
      console.error("Analysis failed → skipping", e);
      analysisData = null;
    }

    if (
      !analysisData ||
      !analysisData.overall ||
      typeof analysisData !== "object"
    ) {
      analysisData = {
        strengths: [],
        weaknesses: [],
        suggestions: [],
        overall:
          "AI could not fully analyze your answers, but the interview was completed.",
      };
    }

    setAnalysis(analysisData);
    setPhase("feedback");

    if (analysisData?.overall)
      speak(`Summary: ${analysisData.overall}`);
    // ---------- FIXED PART END ----------
  }

  // --- UI Components ---

  const Card = ({ children, className = "" }) => (
    <div
      className={`p-6 rounded-xl bg-slate-900 border-2 border-slate-700 shadow-[4px_4px_0px_#475569] transition duration-300 hover:shadow-[6px_6px_0px_#475569] ${className}`}
    >
      {children}
    </div>
  );

  const Button = ({ children, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-lg font-semibold border-2 border-yellow-400 shadow-[3px_3px_0px_#facc15] transition duration-150 hover:shadow-[1px_1px_0px_#facc15] hover:translate-x-[2px] hover:translate-y-[2px] ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-slate-800 text-white px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="text-center">
          <h1 className="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400 drop-shadow-lg">
            AI Interviewer
          </h1>
          <p className="text-slate-400 mt-2 text-lg font-medium">
            Practice for your next technical interview.
          </p>
        </header>

        {/* FORM */}
        {phase === "form" && (
          <Card className="space-y-6">
            <h2 className="text-2xl font-bold text-yellow-300">
              Setup Interview Parameters
            </h2>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1">
                Job Title
              </label>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Software Engineer"
                className="w-full px-4 py-2 rounded-lg bg-slate-700/50 outline-none border border-slate-600 focus:border-red-500 transition duration-200 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1">
                Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700/50 outline-none border border-slate-600 focus:border-red-500 transition duration-200 text-white appearance-none cursor-pointer"
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1">
                Tech Stack (Comma-separated)
              </label>
              <input
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g., React, JavaScript, NodeJS"
                className="w-full px-4 py-2 rounded-lg bg-slate-700/50 outline-none border border-slate-600 focus:border-red-500 transition duration-200 text-white"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={startInterview}
                className="flex-1 bg-red-500 text-white border-red-700 shadow-[3px_3px_0px_#ef4444]"
              >
                Start Interview
              </Button>
              <Button
                onClick={() => {
                  setJobTitle("Frontend Developer");
                  setLevel("mid");
                  setTechStack("React, JavaScript");
                }}
                className="bg-slate-700 text-white border-slate-500 shadow-[3px_3px_0px_#64748b]"
              >
                Reset
              </Button>
            </div>

            {!recognitionRef.current && (
              <p className="text-red-400 text-sm mt-4 p-3 bg-red-900/30 rounded-lg border border-red-700 font-medium">
                ⚠️ **Voice Warning:** Your browser does not support voice
                recognition. Answers will be entered manually via prompt.
              </p>
            )}
          </Card>
        )}

        {/* INTERVIEWING */}
        {phase === "interviewing" && (
          <div className="space-y-8">
            <Card>
              <h2 className="text-2xl font-bold text-red-300 mb-4 flex justify-between items-center">
                Current Question
                <span className="text-sm text-yellow-400 font-mono border border-yellow-400 px-2 py-1 rounded-full">
                    Q{qa.length + 1} / 5
                </span>
              </h2>
              <p className="mt-3 text-2xl font-medium text-slate-100 p-5 bg-slate-800 rounded-lg border-l-4 border-red-500 shadow-inner">
                {question}
              </p>

              {/* Listening indicator */}
              <div className="mt-5 flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div
                  className={`h-4 w-4 rounded-full ${
                    listening
                      ? "bg-green-500 shadow-lg shadow-green-500/50 animate-pulse"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm font-semibold text-slate-400">
                  Status: {listening ? "Speaking now... Listening for your answer." : "Waiting for question or answer input."}
                </span>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="font-bold text-xl text-slate-300 border-b-2 border-slate-700 pb-2">
                Transcript & Previous Answers
              </h3>
              {qa.slice().reverse().map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-700 border border-slate-600 shadow-md"
                >
                  <p className="text-yellow-400 text-sm font-semibold border-b border-slate-600 pb-1">
                    Interviewer Question:
                  </p>
                  <p className="text-slate-300 mt-1 mb-3">{item.q}</p>
                  <p className="text-red-400 text-sm font-semibold border-b border-slate-600 pb-1">
                    Your Answer:
                  </p>
                  <p className="text-slate-200 mt-1">
                    {item.a || "(No recorded answer)"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROCESSING */}
        {phase === "processing" && (
          <div className="mt-20 text-center text-3xl font-bold text-yellow-400 animate-pulse flex flex-col items-center">
            <svg
                className="animate-spin h-8 w-8 text-yellow-400 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                ></circle>
                <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            Generating personalized feedback...
          </div>
        )}

        {/* FEEDBACK */}
        {phase === "feedback" && analysis && (
          <div className="space-y-8">
            <Card className="p-8 border-red-400 shadow-[4px_4px_0px_#f87171]">
              <h2 className="text-3xl font-bold text-red-400 border-b border-slate-700 pb-3">
                Interview Feedback Summary
              </h2>
              <p className="mt-4 text-xl text-slate-200 leading-relaxed">
                {analysis.overall}
              </p>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Strengths */}
              <div className="p-5 rounded-xl bg-slate-900 border-2 border-green-500 shadow-[4px_4px_0px_#10b981]">
                <h3 className="font-bold text-xl mb-3 text-green-400">
                  Strengths 👍
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
                  {analysis.strengths?.length ? (
                    analysis.strengths.map((item, i) => (
                      <li key={i} className="text-base">
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="italic text-slate-500">None listed</li>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-5 rounded-xl bg-slate-900 border-2 border-yellow-500 shadow-[4px_4px_0px_#f59e0b]">
                <h3 className="font-bold text-xl mb-3 text-yellow-400">
                  Weaknesses ⚠️
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
                  {analysis.weaknesses?.length ? (
                    analysis.weaknesses.map((item, i) => (
                      <li key={i} className="text-base">
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="italic text-slate-500">None listed</li>
                  )}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="p-5 rounded-xl bg-slate-900 border-2 border-blue-500 shadow-[4px_4px_0px_#3b82f6]">
                <h3 className="font-bold text-xl mb-3 text-blue-400">
                  Suggestions 💡
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
                  {analysis.suggestions?.length ? (
                    analysis.suggestions.map((item, i) => (
                      <li key={i} className="text-base">
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="italic text-slate-500">None listed</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Transcript */}
            <Card>
              <h3 className="font-bold text-xl text-red-300 border-b-2 border-slate-700 pb-2">
                Full Transcript
              </h3>
              <div className="mt-4 space-y-4 max-h-96 overflow-y-auto pr-2">
                {qa.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 shadow-inner transition duration-200 hover:bg-slate-700"
                  >
                    <p className="text-yellow-400 text-sm font-medium">
                      Q{i + 1}: {item.q}
                    </p>
                    <p className="text-slate-200 mt-1 pl-3 border-l-2 border-red-500">
                      A: {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex gap-4 pt-2">
              <Button
                onClick={() => {
                  setPhase("form");
                  setQa([]);
                  setAnalysis(null);
                }}
                className="flex-1 bg-slate-700 text-white border-slate-500 shadow-[3px_3px_0px_#64748b]"
              >
                Start New Interview
              </Button>

              <Button
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(analysis, null, 2)
                  )
                }
                className="bg-green-600 text-white border-green-700 shadow-[3px_3px_0px_#16a34a]"
              >
                Copy Feedback
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
