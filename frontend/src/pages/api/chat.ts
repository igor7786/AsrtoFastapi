import type { APIRoute } from 'astro';
import dotenv from 'dotenv';
import { headers, errorHandler, messageSchema } from './utils/helpersvalidation';
// load env variables
dotenv.config();

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();
    //! extract last message
    const lastMessage = messages[messages.length - 1];
    const fastAPIUrl = `${process.env.API_AI_ENDPOINT}`;
    // ! validate
    const parsedData = messageSchema.safeParse(lastMessage);
    if (!parsedData.success) {
      const errorMessages = parsedData.error.errors.map((err) => err.message).join(', ');
      return errorHandler(`Validation failed: ${errorMessages}`);
    }
    // ? extract prompt -> validated
    const prompt = parsedData.data.content;
    // Create FormData
    const formData = new FormData();
    formData.append('prompt', prompt);
    // ? check if any files
    if (lastMessage?.experimental_attachments && lastMessage.experimental_attachments.length > 1) {
      return errorHandler('Please load a single file, servers are limited!!');
    }
    if (lastMessage?.experimental_attachments) {
      for (const [index, att] of lastMessage.experimental_attachments.entries()) {
        const data: string = att.url;
        if (data) {
          //? Decode Base64 to binary
          const byteCharacters = atob(data.split(',')[1]); // Remove base64 header
          const byteArrays = [];

          //? Convert the byte characters into an array of bytes
          for (let offset = 0; offset < byteCharacters.length; offset++) {
            byteArrays.push(byteCharacters.charCodeAt(offset));
          }

          const blob = new Blob([new Uint8Array(byteArrays)], { type: 'application/octet-stream' });

          //! Checking if file size is greater than 5MB
          if (blob.size / (1024 * 1024) > 3) {
            return errorHandler('File size limit exceeded is more than 3MB!!'); // Stops execution properly
          }
          //? Use the actual filename from the attachment
          const filename = `${index}+${att.name}` || `${index}` + `files`;
          formData.append(`files`, blob, filename);
        }
      }
    }

    //? Fetch from the FastAPI endpoint
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
