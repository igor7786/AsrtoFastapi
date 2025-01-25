import { streamText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import type { APIRoute } from 'astro';

// Import and configure dotenv
import dotenv from 'dotenv';

dotenv.config();
export const POST: APIRoute = async ({ request }) => {
  const groq = createGroq({
    baseURL: `${process.env.API_AI_BASE}`,
    apiKey: `${process.env.API_AI_KEY}`,
  });
  const { messages } = await request.json();
  const text = streamText({
    model: groq(`${process.env.API_AI_MODEL}`),
    messages: messages,
  });

  return text.toDataStreamResponse();
};
