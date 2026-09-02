/**
 * Gemini Client — thin wrapper around @google/generative-ai.
 * Handles SDK initialization and exposes a single typed call method.
 */
import { GoogleGenerativeAI, GenerationConfig, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';

let _client: GoogleGenerativeAI | null = null;

export const isGeminiConfigured = (): boolean => Boolean(API_KEY && API_KEY.trim().length > 10);

const getClient = (): GoogleGenerativeAI => {
  if (!_client) {
    _client = new GoogleGenerativeAI(API_KEY);
  }
  return _client;
};

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const DEFAULT_GENERATION_CONFIG: GenerationConfig = {
  temperature: 0.4,
  topK: 40,
  topP: 0.9,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

/**
 * Call Gemini 1.5 Flash with a JSON-schema prompt.
 * Returns parsed JSON or throws on error.
 */
export const callGemini = async <T>(prompt: string): Promise<T> => {
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_NOT_CONFIGURED');
  }

  const model = getClient().getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: DEFAULT_GENERATION_CONFIG,
    safetySettings: SAFETY_SETTINGS,
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`Gemini returned non-JSON: ${cleaned.slice(0, 200)}`);
  }
};
