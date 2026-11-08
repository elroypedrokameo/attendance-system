import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Employee } from "./employee.entity";

export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "employee_id", nullable: true })
  employeeId: number;

  @OneToOne(() => Employee, (emp) => emp.user, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "employee_id" })
  employee: Employee;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

