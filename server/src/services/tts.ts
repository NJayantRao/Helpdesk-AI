import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

// Voice ID — eleven_multilingual_v2 supports Hindi, Bengali, Telugu, Odia natively
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL";
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

/**
 * Convert text → MP3 audio buffer using ElevenLabs.
 * Works for English and all major Indic languages.
 */
export async function textToSpeech(text: string): Promise<Buffer> {
  // Add slight pause cadence for natural Indic speech rhythm
  const styledText = text.replace(/\./g, "...");

  const audioStream = await elevenlabs.textToSpeech.convert(VOICE_ID, {
    text: styledText,
    modelId: MODEL_ID,
    outputFormat: "mp3_44100_128",
    voiceSettings: {
      stability: 0.35,
      similarityBoost: 0.85,
      style: 0.75,
      useSpeakerBoost: true,
    },
  });

  // Collect stream → Buffer
  const chunks: Buffer[] = [];
  for await (const chunk of audioStream as AsyncIterable<Buffer>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
