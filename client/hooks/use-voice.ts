"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

// ── Types ──────────────────────────────────────────────────────────────────

export type VoiceState =
  | "idle"
  | "recording"
  | "processing"
  | "playing"
  | "error";

interface VoiceChatResult {
  transcript: string;
  agentResponse: string;
}

interface UseVoiceChatOptions {
  language?: string; // BCP-47 e.g. "en-IN", "hi-IN"
  onResult?: (r: VoiceChatResult) => void;
  onError?: (msg: string) => void;
  onPlaybackEnd?: () => void; // called when audio finishes — caller decides next state
  onVoiceStateChange?: (state: VoiceState) => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useVoiceChat(opts: UseVoiceChatOptions = {}) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [agentResponse, setAgentResponse] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always-fresh opts reference — prevents stale closure bugs in recorder.onstop
  const optsRef = useRef(opts);
  useEffect(() => {
    optsRef.current = opts;
  });

  // ── Stable helpers ─────────────────────────────────────────────────────────

  const stopCurrentAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const clearAutoStop = useCallback(() => {
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
  }, []);

  const goError = useCallback((msg: string) => {
    setVoiceState("error");
    optsRef.current.onError?.(msg);
    setTimeout(() => setVoiceState("idle"), 2000);
  }, []);

  const resetState = useCallback(() => {
    setVoiceState("idle");
    setTranscript("");
    setAgentResponse("");
  }, []);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      clearAutoStop();
      mediaRecorderRef.current?.stop();
      recognitionRef.current?.stop();
      stopCurrentAudio();
      stopStream();
    };
  }, [clearAutoStop, stopCurrentAudio, stopStream]);

  // ── Toggle ─────────────────────────────────────────────────────────────────

  const toggleVoice = useCallback(async () => {
    // Playing → stop immediately
    if (voiceState === "playing") {
      stopCurrentAudio();
      resetState();
      return;
    }

    // Recording → stop + submit (recorder.onstop fires automatically)
    if (voiceState === "recording") {
      clearAutoStop();
      mediaRecorderRef.current?.stop();
      recognitionRef.current?.stop();
      return;
    }

    // Processing / error → ignore tap
    if (voiceState !== "idle") return;

    // ── idle → recording ────────────────────────────────────────────────────
    const lang = optsRef.current.language ?? "en-IN";
    let sttText = "";

    setVoiceState("recording");
    setTranscript("");
    setAgentResponse("");

    // Step 1 — Web Speech API (client-side, zero latency)
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.lang = lang;
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      recognitionRef.current = rec;

      rec.onresult = (e: any) => {
        sttText = e.results[0][0].transcript;
        setTranscript(sttText);
      };

      // When speech ends naturally → stop recorder too
      rec.onend = () => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      };

      // On error → still stop recorder so onstop fires and sends what we have
      rec.onerror = () => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      };

      rec.start();
    }

    // Step 2 — MediaRecorder (audio blob for server Whisper fallback)
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    } catch {
      goError("Microphone access denied.");
      recognitionRef.current?.stop();
      return;
    }

    const mimeType =
      ["audio/webm;codecs=opus", "audio/webm", "audio/ogg"].find((t) =>
        MediaRecorder.isTypeSupported(t)
      ) ?? "";

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      clearAutoStop();
      stopStream();
      recognitionRef.current?.stop();
      setVoiceState("processing");

      const audioBlob = new Blob(audioChunksRef.current, {
        type: mimeType || "audio/webm",
      });

      try {
        const form = new FormData();
        form.append("audio", audioBlob, "voice.webm");
        form.append("lang", lang);
        // Send browser transcript so server can skip Whisper (faster path)
        if (sttText) form.append("transcript", sttText);

        const res = await axios.post(`${API_BASE_URL}/voice/chat`, form, {
          withCredentials: true,
          responseType: "blob",
          // Do NOT set Content-Type — axios sets multipart boundary automatically
        });

        const finalTranscript = decodeURIComponent(
          res.headers["x-transcript"] ?? ""
        );
        const finalAgent = decodeURIComponent(
          res.headers["x-agent-response"] ?? ""
        );

        if (finalTranscript) setTranscript(finalTranscript);
        if (finalAgent) setAgentResponse(finalAgent);

        optsRef.current.onResult?.({
          transcript: finalTranscript || sttText,
          agentResponse: finalAgent,
        });

        // Step 3 — Play ElevenLabs MP3
        setVoiceState("playing");
        const url = URL.createObjectURL(res.data as Blob);
        const audio = new Audio(url);
        currentAudioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          currentAudioRef.current = null;
          // Notify caller BEFORE resetting so it can capture the "playing→idle" transition
          optsRef.current.onPlaybackEnd?.();
          resetState();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(url);
          goError("Audio playback failed.");
        };

        await audio.play();
      } catch (err: any) {
        // Blob error body parsing — axios returns JSON errors as Blob when responseType:"blob"
        let msg = err?.message ?? "Voice request failed.";
        if (err?.response?.data instanceof Blob) {
          try {
            const text = await (err.response.data as Blob).text();
            const json = JSON.parse(text);
            msg = json?.message ?? msg;
          } catch {
            /* ignore */
          }
        } else {
          msg = err?.response?.data?.message ?? msg;
        }
        goError(msg);
      }
    };

    // Collect audio in 250ms chunks for smoother streaming
    recorder.start(250);

    // Auto-stop after 30s to prevent runaway recordings
    autoStopRef.current = setTimeout(() => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }, 30_000);
  }, [
    voiceState,
    goError,
    resetState,
    stopCurrentAudio,
    stopStream,
    clearAutoStop,
  ]);

  // ── Cancel ─────────────────────────────────────────────────────────────────

  const cancelVoice = useCallback(() => {
    clearAutoStop();
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    stopCurrentAudio();
    stopStream();
    resetState();
  }, [clearAutoStop, stopCurrentAudio, stopStream, resetState]);

  return {
    voiceState,
    transcript,
    agentResponse,
    toggleVoice,
    cancelVoice,
    isRecording: voiceState === "recording",
    isProcessing: voiceState === "processing",
    isPlaying: voiceState === "playing",
    isError: voiceState === "error",
    isActive: voiceState !== "idle",
  };
}
