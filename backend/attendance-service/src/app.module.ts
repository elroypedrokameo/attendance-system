import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance } from "./entities/attendance.entity";
import { AttendanceModule } from "./attendance/attendance.module";

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
        database: config.get<string>("DB_NAME", "attendance_db"),
        timezone: "+07:00",
        entities: [Attendance],
        synchronize: false,
      }),
    }),
    AttendanceModule,
  ],
})
export class AppModule {}
