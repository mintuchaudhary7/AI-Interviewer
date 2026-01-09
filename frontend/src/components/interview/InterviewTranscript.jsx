export default function InterviewTranscript({ qa }) {
  if (!qa.length) return null;

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold text-slate-300">
        Previous Questions
      </h3>

      {[...qa].reverse().map((item, i) => (
        <div
          key={i}
          className="p-4 bg-slate-700 rounded-lg border border-slate-600"
        >
          <p className="text-yellow-400 font-semibold">
            Q: {item.question}
          </p>
          <p className="text-slate-200 mt-1">
            A: {item.answer}
          </p>
        </div>
      ))}
    </div>
  );
}
