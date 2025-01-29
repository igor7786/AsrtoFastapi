import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { messages } = await request.json();
  const fastAPIUrl = 'http://localhost:8080/v1/AI/generate-gemma';

  if (!messages) {
    // Return the message object if no messages are provided
    const noMessage =
      '0:"No message provided!!"\n' +
      'e:{"finishReason":"stop","usage":{"promptTokens":null,"completionTokens":null},"isContinued":false}\n';
    return new Response(noMessage, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  try {
    // Fetch from the FastAPI endpoint
    const response = await fetch(fastAPIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: messages[messages.length - 1].content }),
    });
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
        'Transfer-Encoding': 'chunked', // Indicates streaming
        'Cache-Control': 'no-cache', // Ensures client doesn't cache
      },
    });
  } catch (error) {
    const err =
      '0:"Could not fetch response from Server try again Later!!"\n' +
      'e:{"finishReason":"stop","usage":{"promptTokens":null,"completionTokens":null},"isContinued":false}\n';
    return new Response(
      err,

      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Vercel-AI-Data-Stream': 'v1',
          'Transfer-Encoding': 'chunked', // Indicates streaming
          'Cache-Control': 'no-cache', // Ensures client doesn't cache
        },
      }
    );
  }
};
