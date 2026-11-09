import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Attendance, AttendanceStatus } from "../entities/attendance.entity";

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly configService: ConfigService,
  ) {}

  private async getAuthoritativeNow(): Promise<Date> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      const res = await fetch("http://cloudflare.com/cdn-cgi/trace", {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const text = await res.text();
        const match = text.match(/^ts=(\d+(?:\.\d+)?)/m);
        if (match) {
          const epochMs = Math.round(parseFloat(match[1]) * 1000);
          if (!Number.isNaN(epochMs) && epochMs > 0) {
            return new Date(epochMs);
          }
        }
      }
    } catch {
      // Fallback to server system clock if external network trace is unreachable
    }
    return new Date();
  }

  private getWibParts(date: Date): { dateStr: string; timeStr: string } {
    // WIB (Asia/Jakarta) is permanently UTC+7
    const wibDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const iso = wibDate.toISOString();
    return {
      dateStr: iso.slice(0, 10),
      timeStr: iso.slice(11, 16),
    };
  }

  async getServerTime() {
    const now = await this.getAuthoritativeNow();
    const { dateStr, timeStr } = this.getWibParts(now);
    return {
      success: true,
      data: {
        timestamp: now.getTime(),
        iso: now.toISOString(),
        date: dateStr,
        time: timeStr,
        timezone: "Asia/Jakarta",
      },
    };
  }

  async checkIn(payload: { employeeId: number; photo: string; note?: string }) {
    const { employeeId, photo, note } = payload;
    const now = await this.getAuthoritativeNow();
    const { dateStr: today, timeStr: currentTimeStr } = this.getWibParts(now);

    const existing = await this.attendanceRepository.findOne({
      where: { employeeId, date: today },
    });

    if (existing) {
      return {
        success: false,
        message: "You have already checked in today",
      };
    }

    const workStartTime = this.configService.get<string>(
      "WORK_START_TIME",
      "09:15",
    );
    const status =
      currentTimeStr > workStartTime
        ? AttendanceStatus.LATE
        : AttendanceStatus.ON_TIME;

    const attendance = this.attendanceRepository.create({
      employeeId,
      date: today,
      checkInTime: now,
      checkInPhoto: photo,
      checkInNote: note || null,
      status,
    });

    const saved = await this.attendanceRepository.save(attendance);

    return {
      success: true,
      message:
        status === AttendanceStatus.LATE
          ? "Check-in successful (Late)"
          : "Check-in successful (On Time)",
      data: saved,
    };
  }

  async checkOut(payload: {
    employeeId: number;
    photo: string;
    note?: string;
  }) {
    const { employeeId, photo, note } = payload;
    const now = await this.getAuthoritativeNow();
    const { dateStr: today } = this.getWibParts(now);

    const attendance = await this.attendanceRepository.findOne({
      where: { employeeId, date: today },
    });

    if (!attendance) {
      return {
        success: false,
        message: "You have not checked in today",
      };
    }

    if (attendance.checkOutTime) {
      return {
        success: false,
        message: "You have already checked out today",
      };
    }

    attendance.checkOutTime = now;
    attendance.checkOutPhoto = photo;
    attendance.checkOutNote = note || null;

    const saved = await this.attendanceRepository.save(attendance);

    return {
      success: true,
      message: "Check-out successful",
      data: saved,
    };
  }

  async getToday(employeeId: number) {
    const now = await this.getAuthoritativeNow();
    const { dateStr: today } = this.getWibParts(now);
    const attendance = await this.attendanceRepository.findOne({
      where: { employeeId, date: today },
    });

    return {
      success: true,
      data: attendance || null,
    };
  }

  async getMyHistory(
    employeeId: number,
    query: { month?: string; status?: AttendanceStatus },
  ) {
    const queryBuilder = this.attendanceRepository
      .createQueryBuilder("att")
      .where("att.employeeId = :employeeId", { employeeId })
      .orderBy("att.date", "DESC");

    if (query.month) {
      queryBuilder.andWhere("DATE_FORMAT(att.date, '%m') = :month", {
        month: query.month,
      });
    }

    if (query.status) {
      queryBuilder.andWhere("att.status = :status", { status: query.status });
    }

    const items = await queryBuilder.getMany();

    return {
      success: true,
      data: items,
    };
  }

  async getAll(query: {
    date?: string;
    month?: string;
    employeeId?: number;
    status?: AttendanceStatus;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;

    const queryBuilder = this.attendanceRepository
      .createQueryBuilder("att")
      .orderBy("att.createdAt", "DESC");

    if (query.date) {
      const targetDate =
        query.date === "today"
          ? this.getWibParts(await this.getAuthoritativeNow()).dateStr
          : query.date;
      queryBuilder.andWhere("att.date = :date", { date: targetDate });
    }

    if (query.month) {
      queryBuilder.andWhere("DATE_FORMAT(att.date, '%m') = :month", {
        month: query.month,
      });
    }

    if (query.employeeId) {
      queryBuilder.andWhere("att.employeeId = :employeeId", {
        employeeId: Number(query.employeeId),
      });
    }

    if (query.status) {
      queryBuilder.andWhere("att.status = :status", { status: query.status });
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSummary(date?: string) {
    let targetDate = date;
    if (!targetDate || targetDate === "today") {
      const now = await this.getAuthoritativeNow();
      targetDate = this.getWibParts(now).dateStr;
    }

    const attendances = await this.attendanceRepository.find({
      where: { date: targetDate },
    });

    const totalAttended = attendances.filter(
      (a) => a.checkInTime !== null,
    ).length;
    const totalOnTime = attendances.filter(
      (a) => a.status === AttendanceStatus.ON_TIME,
    ).length;
    const totalLate = attendances.filter(
      (a) => a.status === AttendanceStatus.LATE,
    ).length;

    return {
      success: true,
      data: {
        date: targetDate,
        totalAttended,
        totalOnTime,
        totalLate,
      },
    };
  }
}

