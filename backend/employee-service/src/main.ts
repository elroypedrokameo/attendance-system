import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const port = Number(process.env.PORT_EMPLOYEE_SERVICE || 3001);
  const host = process.env.HOST_EMPLOYEE_SERVICE || "0.0.0.0";

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );

  app.enableShutdownHooks();
  await app.listen();
  logger.log(`Microservice running on TCP ${host}:${port}`);
}

bootstrap();
