import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.enableShutdownHooks();
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((err) =>
          Object.values(err.constraints || {}),
        );
        return new BadRequestException(
          messages.join(", ") || "Validation failed",
        );
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Dexa WFH Attendance API")
    .setDescription(
      "API Gateway for WFH Attendance & Employee Monitoring System",
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT_API_GATEWAY || 3000;
  await app.listen(port);
  logger.log(`HTTP server running on http://localhost:${port}/api`);
  logger.log(`Swagger documentation on http://localhost:${port}/api/docs`);
}

bootstrap();
