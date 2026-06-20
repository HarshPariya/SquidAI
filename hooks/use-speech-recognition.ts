"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ——————————————————————————————————————————————————————
 * Cross-platform speech recognition hook
 *
 * Strategy:
 *   Tier 1 — Web Speech API  (Chrome, Edge, Safari desktop, Safari iOS 14.5+, Android Chrome)
 *   Tier 2 — MediaRecorder + Gemini transcription  (Firefox, any browser with getUserMedia)
 *
 * The hook exposes the same interface regardless of which tier is active.
 * —————————————————————————————————————————————————————— */

type SpeechMethod = "webspeech" | "mediarecorder" | "none";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const finalizedRef = useRef("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const methodRef = useRef<SpeechMethod>("none");

  // Web Speech API refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // ——— Detect platform ———
  const isIOSRef = useRef(false);

  // ——— Tier 1: Web Speech API ———
  const createRecognition = useCallback((): SpeechRecognition | null => {
    const SpeechRecognitionAPI =
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();

    // iOS Safari doesn't support continuous mode well — use single-shot
    const isIOS = isIOSRef.current;
    recognition.continuous = !isIOS;
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
        // ignore — this fires normally when user pauses
      } else if (event.error === "aborted") {
        // ignore — we abort intentionally
      } else if (event.error === "network") {
        // On some mobile browsers this fires spuriously
        console.warn("Speech recognition network error (may be transient)");
      } else {
        setError(event.error);
      }
    };

    recognition.onend = () => {
      // On iOS, recognition ends after each phrase in non-continuous mode
      // Auto-restart if we're still supposed to be listening
      if (isIOS && recognitionRef.current === recognition) {
        // Check if we intentionally stopped (recognitionRef would be null)
        try {
          recognition.start();
          return; // keep listening
        } catch {
          // Can't restart — fall through to stopped state
        }
      }

      setIsListening(false);
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };

    return recognition;
  }, []);

  // ——— Tier 2: MediaRecorder fallback helpers ———
  const stopMediaRecorder = useCallback(async (): Promise<string> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        resolve("");
        return;
      }

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        // Stop the media stream tracks
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;

        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];

        if (chunks.length === 0) {
          resolve("");
          return;
        }

        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });

        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(",")[1] || "";
          if (!base64) {
            resolve("");
            return;
          }

          setIsTranscribing(true);
          try {
            const res = await fetch("/api/transcribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                audio: base64,
                mimeType: recorder.mimeType || "audio/webm",
              }),
            });

            if (res.ok) {
              const data = await res.json();
              resolve(data.transcript || "");
            } else {
              const errData = await res.json().catch(() => ({}));
              setError((errData as { error?: string }).error || "Transcription failed");
              resolve("");
            }
          } catch (err) {
            console.error("Transcription error:", err);
            setError("Could not transcribe audio");
            resolve("");
          } finally {
            setIsTranscribing(false);
          }
        };
        reader.readAsDataURL(blob);
      };

      recorder.stop();
    });
  }, []);

  // ——— Detect support on mount ———
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent || "";
    const isIOS = /iP(hone|od|ad)/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    isIOSRef.current = isIOS;

    const secure = window.isSecureContext;

    // Try Web Speech API first
    const SpeechRecognitionAPI =
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (SpeechRecognitionAPI && secure) {
      methodRef.current = "webspeech";
      setIsSupported(true);
      return;
    }

    // Try MediaRecorder fallback
    const hasMediaRecorder =
      typeof navigator.mediaDevices !== "undefined" &&
      typeof MediaRecorder !== "undefined";
    if (hasMediaRecorder && secure) {
      methodRef.current = "mediarecorder";
      setIsSupported(true);
      return;
    }

    // Nothing available
    methodRef.current = "none";
    setIsSupported(false);
    if (!secure) {
      setError("Microphone requires HTTPS");
    } else {
      setError("Speech input not available in this browser");
    }

    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  // ——— Start listening ———
  const startListening = useCallback(() => {
    if (!isSupported) return;
    setError(null);
    setTranscript("");
    finalizedRef.current = "";

    if (methodRef.current === "webspeech") {
      // Abort any previous instance
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }

      try {
        const recognition = createRecognition();
        if (!recognition) {
          setError("Speech recognition unavailable");
          return;
        }
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error("speech start error", err);
        setError("Could not start microphone");
      }
    } else if (methodRef.current === "mediarecorder") {
      // MediaRecorder approach
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          streamRef.current = stream;
          audioChunksRef.current = [];

          // Pick a supported mime type
          const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : MediaRecorder.isTypeSupported("audio/mp4")
            ? "audio/mp4"
            : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
            ? "audio/ogg;codecs=opus"
            : "";

          const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
          const recorder = new MediaRecorder(stream, options);

          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorderRef.current = recorder;
          recorder.start(1000); // collect data every 1s
          setIsListening(true);
          setTranscript("🎤 Recording…");
        })
        .catch((err) => {
          console.error("getUserMedia error:", err);
          if (err instanceof DOMException && err.name === "NotAllowedError") {
            setError("Microphone access denied");
          } else {
            setError("Could not access microphone");
          }
        });
    }
  }, [isSupported, createRecognition]);

  // ——— Stop listening ———
  const stopListening = useCallback(() => {
    if (methodRef.current === "webspeech") {
      if (!recognitionRef.current) return;
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
      setIsListening(false);
    } else if (methodRef.current === "mediarecorder") {
      // Just stop recording — don't transcribe (used when cancelling)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.onstop = () => {
          streamRef.current?.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
          mediaRecorderRef.current = null;
          audioChunksRef.current = [];
        };
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
      setTranscript("");
    }
  }, []);

  // ——— Toggle ———
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // ——— Reset transcript ———
  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  // ——— Stop and get transcript ———
  const stopAndGetTranscript = useCallback(async () => {
    if (methodRef.current === "webspeech") {
      const final = finalizedRef.current || transcript;
      stopListening();
      setTranscript("");
      finalizedRef.current = "";
      return final;
    } else if (methodRef.current === "mediarecorder") {
      setIsListening(false);
      const transcribed = await stopMediaRecorder();
      setTranscript("");
      finalizedRef.current = "";
      return transcribed;
    }
    return "";
  }, [transcript, stopListening, stopMediaRecorder]);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    isTranscribing,
    /** Which method is being used: "webspeech" | "mediarecorder" | "none" */
    speechMethod: methodRef.current,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    stopAndGetTranscript,
  };
}
