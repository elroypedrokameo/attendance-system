import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Department } from "./department.entity";
import { User } from "./user.entity";

@Entity("employees")
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "employee_code", length: 50, unique: true })
  employeeCode: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ name: "department_id" })
  departmentId: number;

  @ManyToOne(() => Department, (dept) => dept.employees)
  @JoinColumn({ name: "department_id" })
  department: Department;

  @Column({ length: 100 })
  position: string;

  @Column({ name: "join_date", type: "date" })
  joinDate: string;

  @Column({ name: "is_active", type: "tinyint", default: 1 })
  isActive: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.employee)
  user: User;
}

