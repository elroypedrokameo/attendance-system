import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export const ATTENDANCE_STATUSES = [
  "ON_TIME",
  "LATE",
  "LEAVE",
  "SICK",
  "ABSENT",
] as const;

export type AttendanceStatusType = (typeof ATTENDANCE_STATUSES)[number];

export interface AttendanceRecordItem {
  id: number;
  employeeId: number;
  date: string;
  checkInTime: string | Date | null;
  checkInPhoto: string | null;
  checkInNote: string | null;
  checkOutTime: string | Date | null;
  checkOutPhoto: string | null;
  checkOutNote: string | null;
  status: AttendanceStatusType;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface EmployeeSummaryItem {
  id: number;
  employeeCode: string;
  name: string;
  position: string;
  department?: {
    id: number;
    name: string;
  };
}

export class AttendanceHistoryQueryDto {
  @ApiPropertyOptional({ example: "11" })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiPropertyOptional({ enum: ATTENDANCE_STATUSES, example: "ON_TIME" })
  @IsOptional()
  @IsIn(ATTENDANCE_STATUSES)
  status?: AttendanceStatusType;
}

export class AttendanceListQueryDto {
  @ApiPropertyOptional({ example: "2026-11-07" })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: "11" })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  employeeId?: number;

  @ApiPropertyOptional({ enum: ATTENDANCE_STATUSES, example: "ON_TIME" })
  @IsOptional()
  @IsIn(ATTENDANCE_STATUSES)
  status?: AttendanceStatusType;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
