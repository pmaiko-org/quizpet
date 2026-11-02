import { NestFactory } from "@nestjs/core";
import { WsAdapter } from "@nestjs/platform-ws";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { GLOBAL_PREFIX } from "./config/constants";
import { setupOpenApi } from "./openapi";
import cookieParser from "cookie-parser";
import type { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableShutdownHooks();
  app.set("trust proxy", 1);
  app.use(cookieParser());
  app.useWebSocketAdapter(new WsAdapter(app));
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
void bootstrap();
