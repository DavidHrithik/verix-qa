/**
 * Universal Enterprise AI / LLM Client
 *
 * Configured for any standard AI gateway, cloud model, or local/on-premise LLM endpoint.
 *
 * Configured via environment variables:
 *   VITE_OPENAI_API_KEY   — API Key / Auth Token
 *   VITE_OPENAI_BASE_URL  — Gateway or Model Base Endpoint URL
 *   VITE_OPENAI_MODEL     — Active Model Identifier
 *
 * NOTE: In production, proxy these calls through a backend to keep your key secret.
 */
import OpenAI from 'openai';

const API_KEY  = import.meta.env.VITE_OPENAI_API_KEY  ?? '';
const BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL ?? 'https://aif-hackathon-nonprod-eastus-001.services.ai.azure.com/openai/v1';
const MODEL    = import.meta.env.VITE_OPENAI_MODEL    ?? 'gpt-5.6-sol';

let _client: OpenAI | null = null;

export const isAiConfigured = (): boolean =>
  Boolean(API_KEY && API_KEY.trim().length > 10);

// Backward-compatible alias
export const isOpenAIConfigured = isAiConfigured;

export const getModelName = (): string => MODEL;

const getClient = (): OpenAI => {
  if (!_client) {
    _client = new OpenAI({
      apiKey:  API_KEY,
      baseURL: BASE_URL,
      dangerouslyAllowBrowser: true, // OK for demos; use a backend proxy in production
    });
  }
  return _client;
};

/**
 * Send a JSON-mode completion request to the connected AI engine.
 * Returns parsed JSON or throws on error.
 */
export const callAiModel = async <T>(prompt: string): Promise<T> => {
  if (!isAiConfigured()) {
    throw new Error('AI_ENGINE_NOT_CONFIGURED');
  }

  const response = await getClient().chat.completions.create({
    model:           MODEL,
    response_format: { type: 'json_object' },
    temperature:     0.4,
    max_tokens:      8192,
    messages: [
      {
        role:    'system',
        content: 'You are a senior QA engineer. Always respond with valid JSON only — no markdown, no prose, no code fences. Your entire response must be a single valid JSON object.',
      },
      {
        role:    'user',
        content: prompt,
      },
    ],
  });

  const text = response.choices[0]?.message?.content ?? '';

  // Strip accidental markdown fences just in case
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`AI Model returned non-JSON: ${cleaned.slice(0, 200)}`);
  }
};

// Backward-compatible alias
export const callOpenAI = callAiModel;
