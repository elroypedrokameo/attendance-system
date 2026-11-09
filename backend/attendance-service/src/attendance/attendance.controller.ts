import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AttendanceService } from "./attendance.service";
import { AttendanceStatus } from "../entities/attendance.entity";

export interface AttendanceQueryPayload {
  date?: string;
  month?: string;
  employeeId?: number;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
}

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern("attendance.check_in")
  async checkIn(
    @Payload() payload: { employeeId: number; photo: string; note?: string },
  ) {
    return this.attendanceService.checkIn(payload);
  }

  @MessagePattern("attendance.check_out")
  async checkOut(
    @Payload() payload: { employeeId: number; photo: string; note?: string },
  ) {
    return this.attendanceService.checkOut(payload);
  }

  @MessagePattern("attendance.get_today")
  async getToday(@Payload() payload: { employeeId: number }) {
    return this.attendanceService.getToday(payload.employeeId);
  }

  @MessagePattern("attendance.get_my_history")
  async getMyHistory(
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
  async getAll(@Payload() query: AttendanceQueryPayload) {
    return this.attendanceService.getAll(query || {});
  }

  @MessagePattern("attendance.get_summary")
  async getSummary(@Payload() payload: { date?: string }) {
    return this.attendanceService.getSummary(payload?.date);
  }

  @MessagePattern("attendance.get_server_time")
  async getServerTime() {
    return this.attendanceService.getServerTime();
  }
}

