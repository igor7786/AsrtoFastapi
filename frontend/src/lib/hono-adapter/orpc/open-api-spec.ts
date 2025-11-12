// orpc/open-api-spec.ts
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { onError } from '@orpc/server';
import { CORSPlugin } from '@orpc/server/plugins';
import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from '@orpc/json-schema';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { router } from '@hono-adapt/orpc/routes/router';
import { PlanetSchema } from './schemas/schema';

export const openApiHandler = new OpenAPIHandler(router, {
  interceptors: [onError((err) => console.error('RPC error:', err))],
  plugins: [
    new CORSPlugin(),

    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),

    new OpenAPIReferencePlugin({
      docsProvider: 'swagger', // ← beautiful modern UI
      docsPath: '/docs',
      specPath: '/openapi.json',
      schemaConverters: [new ZodToJsonSchemaConverter()],

      specGenerateOptions: {
        info: {
          title: 'Planet API',
          version: '1.0.0',
          description: 'Interactive documentation for the Planet API.',
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
