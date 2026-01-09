import Card from "../ui/Card";
import Button from "../ui/Button";

export default function InterviewForm({
  jobTitle, setJobTitle,
  level, setLevel,
  techStack, setTechStack,
  startInterview,
  voiceSupported,
}) {
  return (
    <Card className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">
        Setup Interview Parameters
      </h2>

      <div className="space-y-3">
        <label className="block">
          Write Your Job Role
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="eg. Full Stack Developer"
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
          />
        </label>

        <label className="block">
          Select Your Lavel
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
          >
            <option value="junior">Junior</option>
            <option value="mid">Mid-Level</option>
            <option value="senior">Senior</option>
          </select>
        </label>

        <label className="block">
          Write Your Tech Stack
          <input
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="eg. Javascript, React.js"
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
          />
        </label>

      </div>


      <Button
        onClick={startInterview}
        className="bg-red-500 text-white border-red-700"
      >
        Start Interview
      </Button>

      {!voiceSupported && (
        <p className="text-red-400 text-sm">
          Voice not supported. Manual input will be used.
        </p>
      )}
    </Card>
  );
}
