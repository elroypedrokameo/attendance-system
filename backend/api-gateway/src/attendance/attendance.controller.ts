import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Inject,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { FileFilterCallback, memoryStorage } from "multer";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../auth/current-user.decorator";
import { sendRpc } from "../common/rpc.helper";
import { R2StorageService } from "../storage/r2-storage.service";
import {
  AttendanceHistoryQueryDto,
  AttendanceListQueryDto,
  AttendanceRecordItem,
  EmployeeSummaryItem,
} from "./dto/attendance.dto";

const multerOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException("Only JPG, PNG, or WEBP images are allowed"),
      );
    }
  },
};

function normalizeAttendanceRecord<
  T extends { checkInPhoto?: string | null; checkOutPhoto?: string | null },
>(item: T | null | undefined): T | null | undefined {
  if (!item) return item;
  const normalize = (url?: string | null) =>
    url ? url.replace(/^https:\/\/pub-[^/]+\.r2\.dev\//, "/api/storage/") : null;

  return {
    ...item,
    checkInPhoto: normalize(item.checkInPhoto),
    checkOutPhoto: normalize(item.checkOutPhoto),
  };
}

@ApiTags("Attendance")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("attendance")
export class AttendanceController {
  constructor(
    @Inject("ATTENDANCE_SERVICE")
    private readonly attendanceServiceClient: ClientProxy,
    @Inject("EMPLOYEE_SERVICE")
    private readonly employeeServiceClient: ClientProxy,
    private readonly r2StorageService: R2StorageService,
  ) {}

  private async submitPhotoAttendance(
    pattern: "attendance.check_in" | "attendance.check_out",
    missingPhotoMessage: string,
    user: AuthenticatedUser,
    file: Express.Multer.File,
    note?: string,
  ) {
    if (!file) {
      throw new BadRequestException(missingPhotoMessage);
    }
    if (!user.employeeId) {
      throw new BadRequestException(
        "User is not linked to an employee profile",
      );
    }

    const photoUrl = await this.r2StorageService.uploadFile(file);
    const result = await sendRpc<AttendanceRecordItem>(
      this.attendanceServiceClient,
      pattern,
      {
        employeeId: user.employeeId,
        photo: photoUrl,
        note,
      },
    );

    return { ...result, data: normalizeAttendanceRecord(result.data) };
  }

  @Post("check-in")
  @Roles("EMPLOYEE")
  @UseInterceptors(FileInterceptor("photo", multerOptions))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Submit WFH check-in with photo and work plan note",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["photo"],
      properties: {
        photo: { type: "string", format: "binary" },
        note: { type: "string", example: "Working on API integration" },
      },
    },
  })
  checkIn(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
    @Body("note") note?: string,
  ) {
    return this.submitPhotoAttendance(
      "attendance.check_in",
      "WFH photo proof is required",
      user,
      file,
      note,
    );
  }

  @Post("check-out")
  @Roles("EMPLOYEE")
  @UseInterceptors(FileInterceptor("photo", multerOptions))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Submit WFH check-out with photo and summary note",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["photo"],
      properties: {
        photo: { type: "string", format: "binary" },
        note: { type: "string", example: "Completed all sprint tasks" },
      },
    },
  })
  checkOut(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
    @Body("note") note?: string,
  ) {
    return this.submitPhotoAttendance(
      "attendance.check_out",
      "WFH check-out photo proof is required",
      user,
      file,
      note,
    );
  }

  @Get("server-time")
  @Roles("ADMIN", "EMPLOYEE")
  @ApiOperation({
    summary: "Get authoritative server time in Asia/Jakarta (WIB)",
  })
  getServerTime() {
    return sendRpc(this.attendanceServiceClient, "attendance.get_server_time");
  }

  @Get("today")
  @Roles("EMPLOYEE")
  @ApiOperation({
    summary: "Get today's attendance status for logged-in employee",
  })
  async getToday(@CurrentUser() user: AuthenticatedUser) {
    if (!user.employeeId) {
      return { success: true, data: null };
    }

    const res = await sendRpc<AttendanceRecordItem | null>(
      this.attendanceServiceClient,
      "attendance.get_today",
      { employeeId: user.employeeId },
    );

    if (res?.data) {
      res.data = normalizeAttendanceRecord(res.data);
    }

    return res;
  }

  @Get("history")
  @Roles("EMPLOYEE")
  @ApiOperation({ summary: "Get logged-in employee attendance history" })
  async getMyHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: AttendanceHistoryQueryDto,
  ) {
    if (!user.employeeId) {
      return { success: true, data: [] };
    }

    const res = await sendRpc<AttendanceRecordItem[]>(
      this.attendanceServiceClient,
      "attendance.get_my_history",
      {
        employeeId: user.employeeId,
        month: query.month,
        status: query.status,
      },
    );

    if (Array.isArray(res?.data)) {
      res.data = res.data.map(normalizeAttendanceRecord);
    }

    return res;
  }

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Monitor all employee attendances (Admin)" })
  async getAll(@Query() query: AttendanceListQueryDto) {
    const attendanceRes = await sendRpc<AttendanceRecordItem[]>(
      this.attendanceServiceClient,
      "attendance.get_all",
      query,
    );

    if (!attendanceRes.data || attendanceRes.data.length === 0) {
      return attendanceRes;
    }

    const employeeIds = Array.from(
      new Set(attendanceRes.data.map((item) => item.employeeId)),
    );

    const employeesRes = await sendRpc<EmployeeSummaryItem[]>(
      this.employeeServiceClient,
      "employee.find_by_ids",
      { ids: employeeIds },
    );

    const employeeMap = new Map<number, EmployeeSummaryItem>();
    if (Array.isArray(employeesRes.data)) {
      employeesRes.data.forEach((emp) => employeeMap.set(emp.id, emp));
    }

    const mergedData = attendanceRes.data.map((item) => {
      const normalized = normalizeAttendanceRecord(item);
      const emp = employeeMap.get(item.employeeId);
      return {
        ...normalized,
        employeeName: emp?.name || "-",
        employeeCode: emp?.employeeCode || "-",
        department: emp?.department?.name || "-",
        position: emp?.position || "-",
      };
    });

    return {
      ...attendanceRes,
      data: mergedData,
    };
  }

  @Get("summary")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get today's attendance summary metrics (Admin)" })
  @ApiQuery({ name: "date", required: false, example: "2026-11-07" })
  async getSummary(@Query("date") date?: string) {
    const [attSummary, empActive] = await Promise.all([
      sendRpc<{
        date: string;
        totalAttended: number;
        totalOnTime: number;
        totalLate: number;
      }>(this.attendanceServiceClient, "attendance.get_summary", { date }),
      sendRpc<{ totalActive: number }>(
        this.employeeServiceClient,
        "employee.count_active",
      ),
    ]);

    const totalActiveEmployees = empActive.data?.totalActive || 0;
    const summaryData = attSummary.data || {
      totalAttended: 0,
      totalOnTime: 0,
      totalLate: 0,
    };

    return {
      success: true,
      data: {
        ...summaryData,
        totalActiveEmployees,
        totalNotAttended: Math.max(
          0,
          totalActiveEmployees - summaryData.totalAttended,
        ),
      },
    };
  }
}
