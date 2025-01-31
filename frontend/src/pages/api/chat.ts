import type { APIRoute } from 'astro';
//
// export const POST: APIRoute = async ({ request }) => {
//   const { messages } = await request.json();
//   const fastAPIUrl = 'http://localhost:8080/v1/AI/generate-gemma';
//   if (!messages) {
//     // Return the message object if no messages are provided
//     const noMessage =
//       '0:"No message provided!!"\n' +
//       'e:{"finishReason":"stop","usage":{"promptTokens":null,"completionTokens":null},"isContinued":false}\n';
//     return new Response(noMessage, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
//   const lastMessage = messages[messages.length - 1];
//   const prompt = lastMessage.content;
//
//   // Extract attachments if they exist
//   const attachments = lastMessage.experimental_attachments?.map((att: any) => att.url) || [];
//   try {
//     // Fetch from the FastAPI endpoint
//     const response = await fetch(fastAPIUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ prompt: prompt, attachments: attachments }),
//     });
//     return new Response(response.body, {
//       status: 200,
//       headers: {
//         'Content-Type': 'text/plain; charset=utf-8',
//         'X-Vercel-AI-Data-Stream': 'v1',
//         'Transfer-Encoding': 'chunked', // Indicates streaming
//         'Cache-Control': 'no-cache', // Ensures client doesn't cache
//       },
//     });
//   } catch (error) {
//     const err =
//       '0:"Could not fetch response from Server try again Later!!"\n' +
//       'e:{"finishReason":"stop","usage":{"promptTokens":null,"completionTokens":null},"isContinued":false}\n';
//     return new Response(
//       err,
//
//       {
//         status: 200,
//         headers: {
//           'Content-Type': 'text/plain; charset=utf-8',
//           'X-Vercel-AI-Data-Stream': 'v1',
//           'Transfer-Encoding': 'chunked', // Indicates streaming
//           'Cache-Control': 'no-cache', // Ensures client doesn't cache
//         },
//       }
//     );
//   }
// };
export const POST: APIRoute = async ({ request }) => {
  const { messages } = await request.json();
  const fastAPIUrl = 'http://localhost:8080/v1/AI/test/generate-gemma';

  if (!messages) {
    const noMessage =
      '0:"No message provided!!"\n' +
      'e:{"finishReason":"stop","usage":{"promptTokens":null,"completionTokens":null},"isContinued":false}\n';
    return new Response(noMessage, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const lastMessage = messages[messages.length - 1];
  const prompt = lastMessage.content;

  // Create FormData
  const formData = new FormData();
  formData.append('prompt', prompt);
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
  console.log(formData);
  try {
    // Fetch from the FastAPI endpoint
    const response = await fetch(fastAPIUrl, {
      method: 'POST',
      body: formData, // Send as multipart/form-data
    });

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    const err =
      '0:"Could not fetch response from Server try again Later!!"\n' +
      'e:{"finishReason":"stop","usage":{"promptTokens":null,"completionTokens":null},"isContinued":false}\n';
    return new Response(err, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  }
};
