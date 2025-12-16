import fs from 'node:fs';
import { minifyContractRouter } from '@orpc/contract';
import { router } from '@hono-adapt/orpc/routes/router';

const minifiedRouter = minifyContractRouter(router);

fs.writeFileSync(
  './src/lib/hono-adapter/orpc/open-api-docs/contract.json',
  JSON.stringify(minifiedRouter)
);
console.log('✅ Generated contract.json');
