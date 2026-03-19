import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { ENV } from "../lib/env.js";

const elevenlabs = new ElevenLabsClient({
  apiKey: ENV.ELEVENLABS_API_KEY,
});

const VOICE_ID = ENV.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL";
const MODEL_ID = ENV.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

export async function textToSpeech(text: string): Promise<Buffer> {
  console.log(`[TTS] Converting ${text.length} chars to speech`);

  // Slight pause cadence for natural spoken rhythm
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

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream as AsyncIterable<Buffer>) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);
  console.log(`[TTS] ✅ Generated ${buffer.length} bytes of audio`);
  return buffer;
}
