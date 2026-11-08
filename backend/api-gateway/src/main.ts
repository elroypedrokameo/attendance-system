import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix("api");

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
  console.log(
    `[api-gateway] HTTP server running on http://localhost:${port}/api`,
  );
  console.log(
    `[api-gateway] Swagger documentation on http://localhost:${port}/api/docs`,
  );
}

bootstrap();

