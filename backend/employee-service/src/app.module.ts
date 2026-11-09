import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtSignOptions } from "@nestjs/jwt";
import { Department } from "./entities/department.entity";
import { Employee } from "./entities/employee.entity";
import { User } from "./entities/user.entity";
import { EmployeeService } from "./employee/employee.service";
import { AuthService } from "./auth/auth.service";
import { EmployeeController } from "./employee/employee.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>("DB_HOST", "localhost"),
        port: Number(config.get<number>("DB_PORT", 3307)),
        username: config.get<string>("DB_USER", "dexa_user"),
        password: config.get<string>("DB_PASSWORD", ""),
        database: config.get<string>("DB_NAME", "employee_db"),
        entities: [Department, Employee, User],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Department, Employee, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: config.get<string>(
            "JWT_EXPIRATION",
            "1d",
          ) as JwtSignOptions["expiresIn"],
        },
      }),
    }),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, AuthService],
})
export class AppModule {}

