// orpc/open-api-spec.ts
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { onError, ORPCError } from '@orpc/server';
import { CORSPlugin } from '@orpc/server/plugins';
import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from '@orpc/json-schema';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { router } from '@hono-adapt/orpc/routes/router';
import { PlanetSchema } from '@/lib/types-schemas-validator/orpc-schemas-types/planet';
import { RequestHeadersPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins';

export const openApiHandler = new OpenAPIHandler(router, {
  interceptors: [
    onError((err) => {
      if (err instanceof ORPCError) {
        console.error('[ORPC Error]:', err.status, err.code, err.message);
        return;
      }
      console.error('Unexpected error:', err);
    }),
  ],
  plugins: [
    new RequestHeadersPlugin(),
    new ResponseHeadersPlugin(),
    new CORSPlugin({
      exposeHeaders: ['Content-Disposition'],
      origin: (origin, options) => origin,
      allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    }),

    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),

    new OpenAPIReferencePlugin({
      docsProvider: 'scalar', // ← better than swagger
      docsPath: '/orpc-docs',
      specPath: '/generate-schema',
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'ORPC API',
          version: '1.0.0',
          description: 'ORPC All endpoints',
        },
        servers: [{ url: '/api/rpc' }],
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
