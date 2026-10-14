import { GoogleGenAI } from '@google/genai';
import { ENV } from './env.js';

let aiClient: GoogleGenAI | null = null;

if (ENV.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: ENV.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('⚠️ Could not initialize Gemini SDK:', err);
  }
}

export function getGeminiClient(): GoogleGenAI | null {
  return aiClient;
}

export function isGeminiConfigured(): boolean {
  return Boolean(aiClient);
}
