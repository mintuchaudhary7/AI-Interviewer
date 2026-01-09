import { useEffect, useRef, useState } from "react";

export function useSpeech() {
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const [listening, setListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);

    rec.onend = () => {
      setListening(false);
      setInterimTranscript("");
    };

    rec.onerror = () => {
      setListening(false);
      setInterimTranscript("");
    };

    rec.onresult = (event) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalText) {
        setFinalTranscript((prev) => prev + finalText);
      }

      setInterimTranscript(interim);
    };

    recognitionRef.current = rec;
  }, []);

  function speak(text, onEnd) {
    if (!synthRef.current) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = onEnd;

    synthRef.current.cancel();
    synthRef.current.speak(utter);
  }

  function startListening() {
    setFinalTranscript("");
    setInterimTranscript("");
    try {
      recognitionRef.current?.start();
    } catch {}
  }

  function stopListening() {
    try {
      recognitionRef.current?.stop();
    } catch {}
  }

  return {
    speak,
    startListening,
    stopListening,
    listening,
    supported: !!recognitionRef.current,

    transcript: `${finalTranscript}${interimTranscript}`,
    finalTranscript,
  };
}
