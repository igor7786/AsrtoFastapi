import type { APIRoute } from 'astro';
import dotenv from 'dotenv';

dotenv.config();

function errorHandler(error: string) {
  const err = '0:"' + error + '"\n';
  ('e:{"finishReason":"stop","usage":{"promptTokens":null,"completionTokens":null},"isContinued":false}\n');
  return new Response(err, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const { messages } = await request.json();
  const fastAPIUrl = `${process.env.API_AI_ENDPOINT}`;
  if (!messages) {
    return errorHandler('No message provided!!');
  }

  const lastMessage = messages[messages.length - 1];
  const prompt = lastMessage.content;

  // Create FormData
  const formData = new FormData();
  formData.append('prompt', prompt);

  if (lastMessage?.experimental_attachments && lastMessage.experimental_attachments.length > 1) {
    return errorHandler('Please load a single file, servers are limited!!');
  }
  lastMessage.experimental_attachments?.forEach((att: any, index: number) => {
    const data: string = att.url;
    if (data) {
      // Decode Base64 to binary
      const byteCharacters = atob(data.split(',')[1]); // Remove base64 header
      const byteArrays = [];

      // Convert the byte characters into an array of bytes
      for (let offset = 0; offset < byteCharacters.length; offset++) {
        byteArrays.push(byteCharacters.charCodeAt(offset));
      }

      const blob = new Blob([new Uint8Array(byteArrays)], { type: 'application/octet-stream' });

      // Use the actual filename from the attachment
      const filename = `${index}+${att.name}` || `files`; // Fallback to index if no filename provided
      formData.append(`files`, blob, filename);
    }
  });
  try {
    // Fetch from the FastAPI endpoint
    const response = await fetch(fastAPIUrl, {
      method: 'POST',
      body: formData, // Send as multipart/form-data
    });
    if (!response.ok) {
      return errorHandler('Could not fetch response from Server try again Later!!');
    }
    return new Response(response.body, {
      status: 201,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return errorHandler('Could not fetch response from Server try again Later!!!');
  }
};
