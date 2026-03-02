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

  // helper factory used by initial setup and every time we start listening
  const createRecognition = useCallback((): SpeechRecognition | null => {
    const SpeechRecognitionAPI =
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return null;

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
          recognition.abort();
        } catch {
          // ignore
        }
        setIsListening(false);
      } else if (event.error === "no-speech") {
        // ignore
      } else {
        setError(event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // clear reference so we always create a fresh one next time
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };

    return recognition;
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- support detection must run after mount */
    if (typeof window === "undefined") return;

    // make sure we are running in a secure context (required by Chrome mobile)
    const secure = window.isSecureContext;
    const ua = navigator.userAgent || "";
    const isIOS = /iP(hone|od|ad)/.test(ua);

    const test = createRecognition();
    if (test && secure && !isIOS) {
      setIsSupported(true);
      recognitionRef.current = test; // keep a spare
    } else {
      setIsSupported(false);
      if (!secure) {
        setError("Web Speech API requires HTTPS/secure context");
      } else if (isIOS) {
        setError("Speech recognition not supported on iOS");
      }
    }

    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, [createRecognition]);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    setError(null);
    setTranscript("");
    finalizedRef.current = "";

    // abort any previous instance just to be safe
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    try {
      const recognition = createRecognition();
      if (!recognition) return;

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error("speech start error", err);
      setError("Could not start microphone");
    }
  }, [isSupported, createRecognition]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.abort();
    } catch {
      // ignore
    }
    recognitionRef.current = null;
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
