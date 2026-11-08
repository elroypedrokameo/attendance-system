import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
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

  await app.listen();
  console.log(`[employee-service] running on TCP ${host}:${port}`);
}

bootstrap();

