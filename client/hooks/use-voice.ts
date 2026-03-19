"use client";

import { useRef, useState, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

// ── Voice state machine ────────────────────────────────────────────────────
// idle → recording → processing → playing → idle
// Any step can go → error → idle (after 2s)

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
  onResult?: (r: VoiceChatResult) => void; // called after agent replies
  onError?: (msg: string) => void;
}

export function useVoiceChat(opts: UseVoiceChatOptions = {}) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [agentResponse, setAgentResponse] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ── helpers ───────────────────────────────────────────────────────────────

  function goError(msg: string) {
    setVoiceState("error");
    opts.onError?.(msg);
    setTimeout(() => setVoiceState("idle"), 2000);
  }

  function stopCurrentAudio() {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  // ── Main toggle ───────────────────────────────────────────────────────────
  // Single mic click drives the whole lifecycle.

  const toggleVoice = useCallback(async () => {
    // ── If playing → stop ──────────────────────────────────────────────────
    if (voiceState === "playing") {
      stopCurrentAudio();
      setVoiceState("idle");
      return;
    }

    // ── If recording → stop + submit ──────────────────────────────────────
    if (voiceState === "recording") {
      mediaRecorderRef.current?.stop();
      recognitionRef.current?.stop();
      // MediaRecorder onstop fires → submits automatically
      return;
    }

    // ── idle → recording ──────────────────────────────────────────────────
    if (voiceState !== "idle") return;

    const lang = opts.language ?? "en-IN";
    let sttText = "";

    setVoiceState("recording");

    // ── Step 1: Web Speech API for transcript (primary) ───────────────────
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
      rec.onerror = () => {
        /* fallback to Gemini on server */
      };
      rec.start();
    }

    // ── Step 2: MediaRecorder for audio blob (sent to server) ─────────────
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    } catch {
      goError("Microphone access denied.");
      recognitionRef.current?.stop();
      return;
    }

    // Pick the best supported MIME type
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      stopStream();
      recognitionRef.current?.stop();
      setVoiceState("processing");

      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

      try {
        // ── Step 3: POST audio + transcript → /api/v1/voice/chat ──────────
        const form = new FormData();
        form.append("audio", audioBlob, "voice.webm");
        form.append("lang", lang);
        if (sttText) form.append("transcript", sttText); // send if we have it

        const res = await axios.post(`${API_BASE_URL}/voice/chat`, form, {
          withCredentials: true,
          responseType: "blob",
          headers: { "Content-Type": "multipart/form-data" },
        });

        // ── Step 4: Read metadata headers ─────────────────────────────────
        const finalTranscript = decodeURIComponent(
          res.headers["x-transcript"] ?? ""
        );
        const finalAgent = decodeURIComponent(
          res.headers["x-agent-response"] ?? ""
        );

        if (finalTranscript) setTranscript(finalTranscript);
        if (finalAgent) setAgentResponse(finalAgent);

        opts.onResult?.({
          transcript: finalTranscript || sttText,
          agentResponse: finalAgent,
        });

        // ── Step 5: Play the MP3 response ──────────────────────────────────
        setVoiceState("playing");
        const url = URL.createObjectURL(res.data as Blob);
        const audio = new Audio(url);
        currentAudioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          currentAudioRef.current = null;
          setVoiceState("idle");
          setTranscript("");
          setAgentResponse("");
        };

        audio.onerror = () => {
          URL.revokeObjectURL(url);
          goError("Audio playback failed.");
        };

        await audio.play();
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Voice request failed.";
        goError(msg);
      }
    };

    recorder.start();
  }, [voiceState, opts]);

  // Cancel everything cleanly
  const cancelVoice = useCallback(() => {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    stopCurrentAudio();
    stopStream();
    setVoiceState("idle");
    setTranscript("");
    setAgentResponse("");
  }, []);

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
