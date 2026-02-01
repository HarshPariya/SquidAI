"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/** Speech-to-text using Web Speech API. Works in Chrome, Edge, Safari. */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const finalizedRef = useRef("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- support detection must run after mount */
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    
    const createRecognition = () => {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            finalizedRef.current += (finalizedRef.current ? " " : "") + text;
          }
        }
        const interims = [...event.results].slice(event.resultIndex).filter((r) => !r.isFinal);
        const interimText = interims.length > 0 ? interims[interims.length - 1][0].transcript : "";
        setTranscript(finalizedRef.current + (interimText ? " " + interimText : ""));
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === "not-allowed") {
          setError("Microphone access denied");
          try {
            recognition.stop();
          } catch {
            // ignore
          }
          setIsListening(false);
        } else if (event.error === "no-speech") {
          // User stopped without speaking - not a critical error
        } else {
          setError(event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      return recognition;
    };

    recognitionRef.current = createRecognition();
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    setError(null);
    setTranscript("");
    finalizedRef.current = "";
    try {
      // Create a fresh recognition instance since Web Speech API cannot restart after ending
      const SpeechRecognitionAPI =
        (window as Window & { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
        (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) return;

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            finalizedRef.current += (finalizedRef.current ? " " : "") + text;
          }
        }
        const interims = [...event.results].slice(event.resultIndex).filter((r) => !r.isFinal);
        const interimText = interims.length > 0 ? interims[interims.length - 1][0].transcript : "";
        setTranscript(finalizedRef.current + (interimText ? " " + interimText : ""));
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === "not-allowed") {
          setError("Microphone access denied");
          setIsListening(false);
        } else if (event.error === "no-speech") {
          // ignore
        } else {
          setError(event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setError("Could not start microphone");
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  /** Stop listening and return the final transcript (for appending to input) */
  const stopAndGetTranscript = useCallback(() => {
    const final = finalizedRef.current || transcript;
    stopListening();
    setTranscript("");
    finalizedRef.current = "";
    return final;
  }, [transcript, stopListening]);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    stopAndGetTranscript,
  };
}
