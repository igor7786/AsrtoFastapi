import type { APIRoute } from 'astro';
import dotenv from 'dotenv';
import { headers, errorHandler, messageSchema } from './utils/helpersvalidation';
// load env variables
dotenv.config();

export const POST: APIRoute = async ({ request }) => {
  const { messages } = await request.json();
  //! extract last message
  throw new Error('This is a test error');
};
