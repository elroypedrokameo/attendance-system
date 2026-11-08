import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from "typeorm";

export enum AttendanceStatus {
  ON_TIME = "ON_TIME",
  LATE = "LATE",
  LEAVE = "LEAVE",
  SICK = "SICK",
  ABSENT = "ABSENT",
}

@Entity("attendances")
@Unique("uq_employee_date", ["employeeId", "date"])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "employee_id" })
  @Index("idx_employee_id")
  employeeId: number;

  @Column({ type: "date" })
  @Index("idx_attendance_date")
  date: string;

  @Column({ name: "check_in_time", type: "datetime", nullable: true })
  checkInTime: Date | null;

  @Column({ name: "check_in_photo", length: 500, nullable: true })
  checkInPhoto: string | null;

  @Column({ name: "check_in_note", length: 500, nullable: true })
  checkInNote: string | null;

  @Column({ name: "check_out_time", type: "datetime", nullable: true })
  checkOutTime: Date | null;

  @Column({ name: "check_out_photo", length: 500, nullable: true })
  checkOutPhoto: string | null;

  @Column({ name: "check_out_note", length: 500, nullable: true })
  checkOutNote: string | null;

  @Column({
    type: "enum",
    enum: AttendanceStatus,
    default: AttendanceStatus.ON_TIME,
  })
  status: AttendanceStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

