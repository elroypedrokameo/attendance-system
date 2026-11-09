import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
  EmployeeService,
  FindAllEmployeeQuery,
  CreateEmployeeInput,
} from "./employee.service";
import { AuthService } from "../auth/auth.service";
import { Employee } from "../entities/employee.entity";

@Controller()
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern("auth.login")
  async login(@Payload() payload: { email: string; password: string }) {
    return this.authService.login(payload);
  }

  @MessagePattern("auth.get_profile")
  async getProfile(@Payload() payload: { userId: number }) {
    return this.authService.getProfile(payload.userId);
  }

  @MessagePattern("employee.find_all")
  async findAll(@Payload() query: FindAllEmployeeQuery) {
    return this.employeeService.findAll(query || {});
  }

  @MessagePattern("employee.find_by_id")
  async findById(@Payload() payload: { id: number }) {
    return this.employeeService.findById(payload.id);
  }

  @MessagePattern("employee.find_by_ids")
  async findByIds(@Payload() payload: { ids: number[] }) {
    return this.employeeService.findByIds(payload.ids || []);
  }

  @MessagePattern("employee.create")
  async create(@Payload() data: CreateEmployeeInput) {
    return this.employeeService.create(data);
  }

  @MessagePattern("employee.update")
  async update(@Payload() payload: { id: number; data: Partial<Employee> }) {
    return this.employeeService.update(payload.id, payload.data);
  }

  @MessagePattern("employee.remove")
  async remove(@Payload() payload: { id: number }) {
    return this.employeeService.remove(payload.id);
  }

  @MessagePattern("employee.get_departments")
  async getDepartments() {
    return this.employeeService.getDepartments();
  }

  @MessagePattern("employee.count_active")
  async countActive() {
    return this.employeeService.countActive();
  }
}

