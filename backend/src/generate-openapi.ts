import { NestFactory } from '@nestjs/core';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { OpenApiModule } from './openapi.module';
import { createOpenApiDocument } from './openapi';
import { GLOBAL_PREFIX } from './config/constants';

async function generate() {
  const app = await NestFactory.create(OpenApiModule, {
    logger: false,
  });
  app.setGlobalPrefix(GLOBAL_PREFIX);

  const document = createOpenApiDocument(app);
  const outputPath = join(process.cwd(), 'openapi.json');

  writeFileSync(outputPath, JSON.stringify(document, null, 2));

  await app.close();
}

generate()
  .then(() => {
    console.log('OpenAPI schema generated at backend/openapi.json');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
