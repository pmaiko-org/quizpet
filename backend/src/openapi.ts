import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const createOpenApiDocument = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Quizpet API')
    .setDescription('API schema for frontend type generation')
    .setVersion('1.0.0')
    .build();

  return SwaggerModule.createDocument(app, config);
};

export const setupOpenApi = (app: INestApplication) => {
  const documentFactory = () => createOpenApiDocument(app);

  SwaggerModule.setup('docs', app, documentFactory, {
    useGlobalPrefix: true,
    jsonDocumentUrl: 'docs-json',
  });
};
