const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-120b';

const SYSTEM_PROMPT = `You are RAIMA AI, a warm, friendly, and helpful AI voice assistant.
Keep responses concise and conversational — ideal for spoken dialogue (2-4 sentences unless more detail is requested).
Be empathetic, natural, and engaging. Avoid markdown, bullet points, or formatting that doesn't work well when spoken aloud.`;

function getApiKey() {
  return import.meta.env.VITE_API_KEY ?? process.env.VITE_API_KEY;
}

/**
 * Request a chat completion from the Groq API.
 * @param {Array<{ role: 'user' | 'assistant', content: string }>} messages
 * @returns {Promise<string>}
 */
export async function getChatCompletion(messages) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('Missing API key. Set VITE_API_KEY in your .env file.');
  }

  const response = await fetch(
    import.meta.env.VITE_API_URL ?? GROQ_CHAT_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_API_MODEL ?? GROQ_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 1024,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message =
      error.error?.message ?? error.message ?? `API error (${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}
