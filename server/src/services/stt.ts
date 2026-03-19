import { InferenceClient } from "@huggingface/inference";
import { ENV } from "../lib/env.js";

const client = new InferenceClient(ENV.HF_TOKEN);

// Language code → human name for Whisper language hint
const LANG_NAMES: Record<string, string> = {
  "en-IN": "english",
  "hi-IN": "hindi",
  "or-IN": "oriya",
  "bn-IN": "bengali",
  "te-IN": "telugu",
  "ta-IN": "tamil",
  "mr-IN": "marathi",
  "gu-IN": "gujarati",
  "kn-IN": "kannada",
  "ml-IN": "malayalam",
  "pa-IN": "punjabi",
};

export async function speechToText(
  audioBuffer: Buffer,
  langCode = "en-IN"
): Promise<string> {
  try {
    const langHint = LANG_NAMES[langCode] ?? "english";

    console.log(
      `[STT] Transcribing ${audioBuffer.length} bytes, lang: ${langHint}`
    );

    const blob = new Blob([new Uint8Array(audioBuffer)]);

    const output = await client.automaticSpeechRecognition({
      inputs: blob,
      model: "openai/whisper-large-v3",
      provider: "fal-ai",
      parameters: {
        language: langHint,
        task: "transcribe",
      } as Record<string, unknown>,
    });

    const text = (output as any).text?.trim() ?? "";

    console.log(`[STT] Transcript: "${text.slice(0, 80)}"`);

    return text;
  } catch (err) {
    console.error("[STT] Whisper failed:", err);
    return "";
  }
}
