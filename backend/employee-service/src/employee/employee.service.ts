import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In, DataSource } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Employee } from "../entities/employee.entity";
import { Department } from "../entities/department.entity";
import { User, UserRole } from "../entities/user.entity";

export interface FindAllEmployeeQuery {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: number | string;
  isActive?: number | string;
}

export interface CreateEmployeeInput {
  employeeCode: string;
  name: string;
  email: string;
  phone?: string;
  departmentId: number;
  position: string;
  joinDate: string;
  password?: string;
}

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: FindAllEmployeeQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;

    const queryBuilder = this.employeeRepository
      .createQueryBuilder("employee")
      .leftJoinAndSelect("employee.department", "department")
      .leftJoin("employee.user", "user")
      .where("(user.role IS NULL OR user.role != :adminRole)", {
        adminRole: "ADMIN",
      })
      .orderBy("employee.id", "DESC");

    if (query.search) {
      queryBuilder.andWhere(
        "(employee.name LIKE :search OR employee.email LIKE :search OR employee.employeeCode LIKE :search OR employee.position LIKE :search)",
        { search: `%${query.search}%` },
      );
    }

    if (query.departmentId) {
      queryBuilder.andWhere("employee.departmentId = :departmentId", {
        departmentId: Number(query.departmentId),
      });
    }

    if (query.isActive !== undefined && query.isActive !== "") {
      queryBuilder.andWhere("employee.isActive = :isActive", {
        isActive: Number(query.isActive),
      });
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

  async findById(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { department: true },
    });

    if (!employee) {
      return { success: false, message: "Employee not found" };
    }

    return { success: true, data: employee };
  }

  async findByIds(ids: number[]) {
    if (!ids || ids.length === 0) {
      return { success: true, data: [] };
    }

    const employees = await this.employeeRepository.find({
      where: { id: In(ids) },
      relations: { department: true },
    });

    return { success: true, data: employees };
  }

  async create(data: {
    employeeCode: string;
    name: string;
    email: string;
    phone?: string;
    departmentId: number;
    position: string;
    joinDate: string;
    password?: string;
  }) {
    const existingEmail = await this.employeeRepository.findOne({
      where: { email: data.email },
    });
    if (existingEmail) {
      return { success: false, message: "Email is already registered" };
    }

    const existingCode = await this.employeeRepository.findOne({
      where: { employeeCode: data.employeeCode },
    });
    if (existingCode) {
      return { success: false, message: "Employee code already exists" };
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const employee = queryRunner.manager.create(Employee, {
        employeeCode: data.employeeCode,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        departmentId: Number(data.departmentId),
        position: data.position,
        joinDate: data.joinDate,
        isActive: 1,
      });

      const savedEmployee = await queryRunner.manager.save(employee);

      const rawPassword = data.password?.trim() || "password123";
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const user = queryRunner.manager.create(User, {
        employeeId: savedEmployee.id,
        email: data.email,
        password: hashedPassword,
        role: UserRole.EMPLOYEE,
      });

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      return {
        success: true,
        message: "Employee and login account created successfully",
        data: savedEmployee,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create employee",
      };
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, data: Partial<Employee>) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      return { success: false, message: "Employee not found" };
    }

    if (data.email && data.email !== employee.email) {
      const existing = await this.employeeRepository.findOne({
        where: { email: data.email },
      });
      if (existing) {
        return {
          success: false,
          message: "Email is already used by another employee",
        };
      }
    }

    Object.assign(employee, {
      ...data,
      departmentId: data.departmentId
        ? Number(data.departmentId)
        : employee.departmentId,
      isActive:
        data.isActive !== undefined
          ? Number(data.isActive)
          : employee.isActive,
    });
    const updated = await this.employeeRepository.save(employee);

    if (data.email) {
      await this.userRepository.update(
        { employeeId: id },
        { email: data.email },
      );
    }

    return {
      success: true,
      message: "Employee updated successfully",
      data: updated,
    };
  }

  async remove(id: number) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      return { success: false, message: "Employee not found" };
    }

    employee.isActive = 0;
    await this.employeeRepository.save(employee);

    return { success: true, message: "Employee deactivated successfully" };
  }

  async getDepartments() {
    const departments = await this.departmentRepository.find({
      order: { id: "ASC" },
    });
    return { success: true, data: departments };
  }

  async countActive() {
    const count = await this.employeeRepository
      .createQueryBuilder("employee")
      .leftJoin("employee.user", "user")
      .where("employee.isActive = :isActive", { isActive: 1 })
      .andWhere("(user.role IS NULL OR user.role != :adminRole)", {
        adminRole: "ADMIN",
      })
      .getCount();

    return { success: true, data: { totalActive: count } };
  }
}

