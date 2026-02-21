import OpenAI from 'openai';
import { envServer } from '@/lib/env/env.server';

const openai = new OpenAI({
  apiKey: envServer.QWEN_API_KEY,
  baseURL: 'https://dashscope-intl.aliyuncs.com/api/v2/apps/protocols/compatible-mode/v1',
});

async function main() {
  const stream = await openai.responses.create({
    model: 'qwen3.5-plus',
    input: 'What can you do?',
    stream: true,
  });

  // If the provider ever retries / re-sends parts, we can dedupe by part key.
  // For your logs it’s not necessary, but it makes this robust.
  const completedParts = new Set<string>();

  for await (const event of stream) {
    if (event.type === 'response.output_text.delta') {
      process.stdout.write(event.delta ?? '');
    }

    // When a part is "done", you can optionally ensure a newline boundary
    if (event.type === 'response.output_text.done') {
      const key = `${event.item_id}:${event.content_index}`;
      if (!completedParts.has(key)) {
        completedParts.add(key);
        process.stdout.write('\n');
      }
    }

    // Optional: on completed, you can read full response from event.response if present
    // if (event.type === "response.completed") { ... }
  }
}

main().catch(console.error);
