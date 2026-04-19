import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { GLOBAL_PREFIX } from "./config/constants";
import { setupOpenApi } from "./openapi";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: errors => {
        const result = errors.map(error => ({
          property: error.property,
          message: error.constraints
            ? Object.values(error.constraints)[0]
            : "Invalid value",
        }));
        return new BadRequestException(result);
      },
    }),
  );
  app.setGlobalPrefix(GLOBAL_PREFIX);
  setupOpenApi(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
