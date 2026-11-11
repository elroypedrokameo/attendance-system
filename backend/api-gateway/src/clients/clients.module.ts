import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: "EMPLOYEE_SERVICE",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>("EMPLOYEE_SERVICE_HOST", "localhost"),
            port: Number(config.get<number>("PORT_EMPLOYEE_SERVICE", 3001)),
          },
        }),
      },
      {
        name: "ATTENDANCE_SERVICE",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>("ATTENDANCE_SERVICE_HOST", "localhost"),
            port: Number(config.get<number>("PORT_ATTENDANCE_SERVICE", 3002)),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroserviceClientsModule {}
