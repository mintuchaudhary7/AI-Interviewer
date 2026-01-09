import Interview from './pages/Interview';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">AI Interviewer</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter the role, level, and tech stack. The interviewer will speak questions, record your answers (browser mic), and give feedback.
        </p>
        <Interview />
      </div>
    </div>
  );
}
