import { Module } from "@nestjs/common";
import { StorageModule } from "../storage/storage.module";
import { AttendanceController } from "./attendance.controller";

@Module({
  imports: [StorageModule],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
