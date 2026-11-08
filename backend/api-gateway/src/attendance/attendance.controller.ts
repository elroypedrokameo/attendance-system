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
import { memoryStorage } from "multer";
import { lastValueFrom } from "rxjs";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CurrentUser } from "../auth/current-user.decorator";
import { R2StorageService } from "../storage/r2-storage.service";

const multerOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException("Only JPG, PNG, or WEBP images are allowed"),
        false,
      );
    }
  },
};

function normalizeAttendanceRecord(item: any) {
  if (!item) return item;
  const normalize = (url: string | null) => {
    if (!url) return null;
    return url.replace(/^https:\/\/pub-[^/]+\.r2\.dev\//, "/api/storage/");
  };
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
  async checkIn(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body("note") note?: string,
  ) {
    if (!file) {
      throw new BadRequestException("WFH photo proof is required");
    }

    if (!user.employeeId) {
      throw new BadRequestException(
        "User is not linked to an employee profile",
      );
    }

    const photoUrl = await this.r2StorageService.uploadFile(file);

    const result = await lastValueFrom(
      this.attendanceServiceClient.send("attendance.check_in", {
        employeeId: user.employeeId,
        photo: photoUrl,
        note,
      }),
    );

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return { ...result, data: normalizeAttendanceRecord(result.data) };
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
  async checkOut(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body("note") note?: string,
  ) {
    if (!file) {
      throw new BadRequestException("WFH check-out photo proof is required");
    }

    if (!user.employeeId) {
      throw new BadRequestException(
        "User is not linked to an employee profile",
      );
    }

    const photoUrl = await this.r2StorageService.uploadFile(file);

    const result = await lastValueFrom(
      this.attendanceServiceClient.send("attendance.check_out", {
        employeeId: user.employeeId,
        photo: photoUrl,
        note,
      }),
    );

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return { ...result, data: normalizeAttendanceRecord(result.data) };
  }

  @Get("today")
  @Roles("EMPLOYEE")
  @ApiOperation({
    summary: "Get today's attendance status for logged-in employee",
  })
  async getToday(@CurrentUser() user: any) {
    if (!user.employeeId) {
      return { success: true, data: null };
    }

    const res = await lastValueFrom(
      this.attendanceServiceClient.send("attendance.get_today", {
        employeeId: user.employeeId,
      }),
    );

    if (res?.data) {
      res.data = normalizeAttendanceRecord(res.data);
    }

    return res;
  }

  @Get("history")
  @Roles("EMPLOYEE")
  @ApiOperation({ summary: "Get logged-in employee attendance history" })
  @ApiQuery({ name: "month", required: false, example: "11" })
  @ApiQuery({ name: "status", required: false, example: "ON_TIME" })
  async getMyHistory(@CurrentUser() user: any, @Query() query: any) {
    if (!user.employeeId) {
      return { success: true, data: [] };
    }

    const res = await lastValueFrom(
      this.attendanceServiceClient.send("attendance.get_my_history", {
        employeeId: user.employeeId,
        month: query.month,
        status: query.status,
      }),
    );

    if (Array.isArray(res?.data)) {
      res.data = res.data.map(normalizeAttendanceRecord);
    }

    return res;
  }

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Monitor all employee attendances (Admin)" })
  @ApiQuery({ name: "date", required: false, example: "2026-11-07" })
  @ApiQuery({ name: "month", required: false, example: "11" })
  @ApiQuery({ name: "employeeId", required: false, example: 2 })
  @ApiQuery({ name: "status", required: false, example: "ON_TIME" })
  async getAll(@Query() query: any) {
    const attendanceRes = await lastValueFrom(
      this.attendanceServiceClient.send("attendance.get_all", query),
    );

    if (
      !attendanceRes.success ||
      !attendanceRes.data ||
      attendanceRes.data.length === 0
    ) {
      return attendanceRes;
    }

    const employeeIds = Array.from(
      new Set(attendanceRes.data.map((item: any) => item.employeeId)),
    );

    const employeesRes = await lastValueFrom(
      this.employeeServiceClient.send("employee.find_by_ids", {
        ids: employeeIds,
      }),
    );

    const employeeMap = new Map();
    if (employeesRes?.success && Array.isArray(employeesRes.data)) {
      employeesRes.data.forEach((emp: any) => {
        employeeMap.set(emp.id, emp);
      });
    }

    const mergedData = attendanceRes.data.map((item: any) => {
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
  async getSummary(@Query("date") date?: string) {
    const [attSummary, empActive] = await Promise.all([
      lastValueFrom(
        this.attendanceServiceClient.send("attendance.get_summary", { date }),
      ),
      lastValueFrom(
        this.employeeServiceClient.send("employee.count_active", {}),
      ),
    ]);

    const totalActiveEmployees = empActive?.data?.totalActive || 0;
    const summaryData = attSummary?.data || {
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
