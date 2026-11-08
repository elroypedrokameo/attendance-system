import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { JwtStrategy } from "./auth/jwt.strategy";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { RolesGuard } from "./auth/roles.guard";
import { AuthController } from "./auth/auth.controller";
import { EmployeeController } from "./employee/employee.controller";
import { AttendanceController } from "./attendance/attendance.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: config.get<string>("JWT_EXPIRATION", "1d") as any,
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads"),
      serveRoot: "/uploads",
    }),
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
  controllers: [AuthController, EmployeeController, AttendanceController],
  providers: [JwtStrategy, JwtAuthGuard, RolesGuard],
})
export class AppModule {}

