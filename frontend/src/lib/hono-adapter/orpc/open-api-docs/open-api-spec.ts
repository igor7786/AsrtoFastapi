// orpc/open-api-spec.ts
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { onError } from '@orpc/server';
import { CORSPlugin } from '@orpc/server/plugins';
import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from '@orpc/json-schema';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { router } from '@hono-adapt/orpc/routes/router';
import { PlanetSchema } from '@hono-adapt/orpc/schemas/schema';
import { RequestHeadersPlugin } from '@orpc/server/plugins';

export const openApiHandler = new OpenAPIHandler(router, {
  interceptors: [onError((err) => console.error('RPC error:', err))],
  plugins: [
    new RequestHeadersPlugin(),
    new CORSPlugin({
      exposeHeaders: ['Content-Disposition'],
      // origin: ['http://localhost:4321', 'http://localhost:5173'],
      // credentials: true,
      // allowHeaders: ['Content-Type', 'Authorization', 'Content-Length'],
      // allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    }),

    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),

    new OpenAPIReferencePlugin({
      docsProvider: 'scalar', // ← better than swagger
      docsPath: '/orcp-docs',
      specPath: '/generate-schema',
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'ORPC API',
          version: '1.0.0',
          description: 'ORPC All endpoints',
        },
        commonSchemas: {
          Planet: { schema: PlanetSchema },
          UndefinedError: { error: 'UndefinedError' },
        },
      },
    }),
  ],

  eventIteratorKeepAliveEnabled: true,
  eventIteratorKeepAliveInterval: 5000,
  eventIteratorKeepAliveComment: ': ping',
});
