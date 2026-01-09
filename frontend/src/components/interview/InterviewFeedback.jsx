export default function InterviewFeedback({ analysis, restart }) {
  if (!analysis) return null;

  return (
    <div className="space-y-6 p-6 bg-slate-800 rounded-xl">
      <h2 className="text-3xl font-bold text-red-400">
        Interview Feedback
      </h2>

      <p className="mt-4 text-slate-200">{analysis.overall}</p>

      {/* Scores */}
      <Score label="Confidence" value={analysis.confidenceScore} />
      <Score label="Technical" value={analysis.technicalScore} />
      <Score label="Communication" value={analysis.communicationScore} />

      <Section title="Strengths" items={analysis.strengths} />
      <Section title="Weaknesses" items={analysis.weaknesses} />
      <Section title="Suggestions" items={analysis.suggestions} />

      <h3 className="text-xl font-bold mt-6">Per Question Feedback</h3>

      {analysis.perQuestion?.map((q, i) => (
        <div key={i} className="mt-3 p-3 bg-slate-700 rounded">
          <p><b>Q:</b> {q.question}</p>
          <p><b>Your Answer:</b> {q.userAnswer}</p>
          <p><b>Missing:</b> {q.missing}</p>
          <p><b>Ideal:</b> {q.idealAnswer}</p>
        </div>
      ))}

      <button
        onClick={restart}
        className="mt-6 px-6 py-3 bg-red-500 rounded hover:bg-red-600"
      >
        Start New Interview
      </button>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function Score({ label, value }) {
  return (
    <div className="mt-2">
      <p className="font-semibold">{label}</p>
      <div className="w-full bg-slate-600 rounded">
        <div
          className="bg-green-500 h-2 rounded"
          style={{ width: `${value || 0}%` }}
        />
      </div>
    </div>
  );
}

function Section({ title, items = [] }) {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold">{title}</h3>
      <ul className="list-disc ml-6 text-slate-300">
        {items.length === 0 && <li>No data</li>}
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
