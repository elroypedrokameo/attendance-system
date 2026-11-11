import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Inject,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { sendRpc } from "../common/rpc.helper";
import {
  EmployeeQueryDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "./dto/employee.dto";

@ApiTags("Employees")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("employees")
export class EmployeeController {
  constructor(
    @Inject("EMPLOYEE_SERVICE")
    private readonly employeeServiceClient: ClientProxy,
  ) {}

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "List all employees (Admin)" })
  findAll(@Query() query: EmployeeQueryDto) {
    return sendRpc(this.employeeServiceClient, "employee.find_all", query);
  }

  @Get("departments")
  @ApiOperation({ summary: "List all departments" })
  getDepartments() {
    return sendRpc(this.employeeServiceClient, "employee.get_departments");
  }

  @Get("count-active")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Count active employees" })
  countActive() {
    return sendRpc(this.employeeServiceClient, "employee.count_active");
  }

  @Get(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get employee detail by ID" })
  findById(@Param("id", ParseIntPipe) id: number) {
    return sendRpc(this.employeeServiceClient, "employee.find_by_id", { id });
  }

  @Post()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Create new employee and login account" })
  create(@Body() body: CreateEmployeeDto) {
    return sendRpc(this.employeeServiceClient, "employee.create", body);
  }

  @Patch(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Update employee details" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateEmployeeDto,
  ) {
    return sendRpc(this.employeeServiceClient, "employee.update", {
      id,
      data: body,
    });
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Deactivate employee (soft delete)" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return sendRpc(this.employeeServiceClient, "employee.remove", { id });
  }
}
