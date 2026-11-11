import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
  AttendanceQueryPayload,
  AttendanceService,
} from "./attendance.service";
import { AttendanceStatus } from "../entities/attendance.entity";

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern("attendance.check_in")
  checkIn(
    @Payload() payload: { employeeId: number; photo: string; note?: string },
  ) {
    return this.attendanceService.checkIn(payload);
  }

  @MessagePattern("attendance.check_out")
  checkOut(
    @Payload() payload: { employeeId: number; photo: string; note?: string },
  ) {
    return this.attendanceService.checkOut(payload);
  }

  @MessagePattern("attendance.get_today")
  getToday(@Payload() payload: { employeeId: number }) {
    return this.attendanceService.getToday(payload.employeeId);
  }

  @MessagePattern("attendance.get_my_history")
  getMyHistory(
    @Payload()
    payload: {
      employeeId: number;
      month?: string;
      status?: AttendanceStatus;
    },
  ) {
    return this.attendanceService.getMyHistory(payload.employeeId, {
      month: payload.month,
      status: payload.status,
    });
  }

  @MessagePattern("attendance.get_all")
  getAll(@Payload() query: AttendanceQueryPayload) {
    return this.attendanceService.getAll(query || {});
  }

  @MessagePattern("attendance.get_summary")
  getSummary(@Payload() payload: { date?: string }) {
    return this.attendanceService.getSummary(payload?.date);
  }

  @MessagePattern("attendance.get_server_time")
  getServerTime() {
    return this.attendanceService.getServerTime();
  }
}
