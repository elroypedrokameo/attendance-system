import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Department } from "../entities/department.entity";
import { Employee } from "../entities/employee.entity";
import { User } from "../entities/user.entity";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Department, User])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
