import { useState } from "react";
import { useSpeech } from "../hooks/useSpeech";
import { fetchQuestion, analyzeAnswers } from "../utils/api";

import InterviewForm from "../components/interview/InterviewForm";
import InterviewQuestion from "../components/interview/InterviewQuestion";
import InterviewTranscript from "../components/interview/InterviewTranscript";
import InterviewProcessing from "../components/interview/InterviewProcessing";
import InterviewFeedback from "../components/interview/InterviewFeedback";

const TOTAL = 5;

export default function Interview() {
  const [jobTitle, setJobTitle] = useState("");
  const [level, setLevel] = useState("mid");
  const [techStack, setTechStack] = useState("");

  const [phase, setPhase] = useState("form");
  const [question, setQuestion] = useState("");
  const [qa, setQa] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const {
    speak,
    startListening,
    stopListening,
    transcript,
    finalTranscript,
    listening,
    supported,
  } = useSpeech();

  async function loadQuestion(prevQA) {
    const q = await fetchQuestion({
      jobTitle,
      level,
      techStack,
      previousQA: prevQA,
    });

    setQuestion(q);
    speak(q, () => setTimeout(() => startListening(), 1500));
  }

  async function startInterview() {
    setPhase("interviewing");
    setQa([]);
    setAnalysis(null);
    await loadQuestion([]);
  }

  async function submitAnswer() {
    stopListening();

    const answer = finalTranscript.trim() || "I don't know";

    const updatedQA = [...qa, { question, answer }];
    setQa(updatedQA);

    if (updatedQA.length === TOTAL) {
      setPhase("processing");

      const result = await analyzeAnswers({
        jobTitle,
        level,
        techStack,
        qa: updatedQA,
      });

      setAnalysis(result);
      setPhase("feedback");
      return;
    }

    await loadQuestion(updatedQA);
  }

  return (
    <div className="min-h-screen bg-slate-800 text-white px-6 py-12">
      {phase === "form" && (
        <InterviewForm
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          level={level}
          setLevel={setLevel}
          techStack={techStack}
          setTechStack={setTechStack}
          startInterview={startInterview}
          voiceSupported={supported}
        />
      )}

      {phase === "interviewing" && (
        <>
          {/* CURRENT QUESTION */}
          <InterviewQuestion
            question={question}
            listening={listening}
            answer={transcript}
            onSubmit={submitAnswer}
            current={qa.length + 1}
            total={TOTAL}
          />

          {/* PAST QUESTIONS BELOW */}
          <InterviewTranscript qa={qa} />
        </>
      )}

      {phase === "processing" && <InterviewProcessing />}

      {phase === "feedback" && (
        <InterviewFeedback
          analysis={analysis}
          restart={() => setPhase("form")}
        />
      )}
    </div>
  );
}
