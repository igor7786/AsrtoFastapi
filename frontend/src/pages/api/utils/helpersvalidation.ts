import { z } from 'zod';

export const headers = {
  'Content-Type': 'text/plain; charset=utf-8',
  'X-Vercel-AI-Data-Stream': 'v1',
  'Transfer-Encoding': 'chunked',
  'Cache-Control': 'no-cache',
  'X-ERR': 'true',
};

export function errorHandler(error: string) {
  const err = '0:"' + error + '"\n';
  ('e:{"finishReason":"stop","usage":{"promptTokens":null,"completionTokens":null},"isContinued":false}\n');
  return new Response(err, {
    status: 200,
    headers: headers,
  });
}

export const messageSchema = z.object({
  role: z.string(),
  content: z.string().min(2, 'Message must be at least 2 characters long to chat with AI!'),
  experimental_attachments: z
    .array(
      z.object({
        name: z.string(),
        contentType: z.string(),
        url: z.string(),
      })
    )
    .optional(),
});
