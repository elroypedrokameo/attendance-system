import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Department } from "./entities/department.entity";
import { Employee } from "./entities/employee.entity";
import { User } from "./entities/user.entity";
import { AuthModule } from "./auth/auth.module";
import { EmployeeModule } from "./employee/employee.module";

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
    AuthModule,
    EmployeeModule,
  ],
})
export class AppModule {}
