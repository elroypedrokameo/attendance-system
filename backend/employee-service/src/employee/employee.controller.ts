import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
  EmployeeService,
  FindAllEmployeeQuery,
  CreateEmployeeInput,
} from "./employee.service";
import { Employee } from "../entities/employee.entity";

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @MessagePattern("employee.find_all")
  findAll(@Payload() query: FindAllEmployeeQuery) {
    return this.employeeService.findAll(query || {});
  }

  @MessagePattern("employee.find_by_id")
  findById(@Payload() payload: { id: number }) {
    return this.employeeService.findById(payload.id);
  }

  @MessagePattern("employee.find_by_ids")
  findByIds(@Payload() payload: { ids: number[] }) {
    return this.employeeService.findByIds(payload.ids || []);
  }

  @MessagePattern("employee.create")
  create(@Payload() data: CreateEmployeeInput) {
    return this.employeeService.create(data);
  }

  @MessagePattern("employee.update")
  update(@Payload() payload: { id: number; data: Partial<Employee> }) {
    return this.employeeService.update(payload.id, payload.data);
  }

  @MessagePattern("employee.remove")
  remove(@Payload() payload: { id: number }) {
    return this.employeeService.remove(payload.id);
  }

  @MessagePattern("employee.get_departments")
  getDepartments() {
    return this.employeeService.getDepartments();
  }

  @MessagePattern("employee.count_active")
  countActive() {
    return this.employeeService.countActive();
  }
}
