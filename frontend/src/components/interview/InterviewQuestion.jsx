export default function InterviewQuestion({
  question,
  listening,
  answer,
  onSubmit,
  current,
  total,
}) {
  return (
    <div className="bg-slate-700 p-6 rounded-xl border border-slate-600">
      <p className="text-sm text-slate-400 mb-2">
        Question {current} of {total}
      </p>

      <p className="text-xl font-semibold min-h-[48px]">
        {question || "Loading question..."}
      </p>

      <div className="mt-4 bg-slate-800 p-3 rounded min-h-[60px]">
        {answer || (
          <span className="text-slate-500">
            {listening ? "Listening..." : "Waiting for answer"}
          </span>
        )}
      </div>

      <button
        onClick={onSubmit}
        className="mt-4 px-6 py-2 bg-red-500 rounded hover:bg-red-600"
      >
        Submit Answer
      </button>
    </div>
  );
}
