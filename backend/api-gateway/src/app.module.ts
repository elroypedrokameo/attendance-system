import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MicroserviceClientsModule } from "./clients/clients.module";
import { AuthModule } from "./auth/auth.module";
import { EmployeeModule } from "./employee/employee.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MicroserviceClientsModule,
    AuthModule,
    EmployeeModule,
    AttendanceModule,
    StorageModule,
  ],
})
export class AppModule {}
