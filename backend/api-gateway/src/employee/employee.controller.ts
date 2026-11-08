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
  BadRequestException,
  ParseIntPipe,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { lastValueFrom } from "rxjs";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

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
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "departmentId", required: false })
  @ApiQuery({ name: "isActive", required: false })
  async findAll(@Query() query: any) {
    return lastValueFrom(
      this.employeeServiceClient.send("employee.find_all", query),
    );
  }

  @Get("departments")
  @ApiOperation({ summary: "List all departments" })
  async getDepartments() {
    return lastValueFrom(
      this.employeeServiceClient.send("employee.get_departments", {}),
    );
  }

  @Get("count-active")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Count active employees" })
  async countActive() {
    return lastValueFrom(
      this.employeeServiceClient.send("employee.count_active", {}),
    );
  }

  @Get(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get employee detail by ID" })
  async findById(@Param("id", ParseIntPipe) id: number) {
    const result = await lastValueFrom(
      this.employeeServiceClient.send("employee.find_by_id", { id }),
    );
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return result;
  }

  @Post()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Create new employee and login account" })
  @ApiBody({
    schema: {
      type: "object",
      required: [
        "employeeCode",
        "name",
        "email",
        "departmentId",
        "position",
        "joinDate",
      ],
      properties: {
        employeeCode: { type: "string", example: "EMP-2026-006" },
        name: { type: "string", example: "Rina Kartika" },
        email: { type: "string", example: "rina.kartika@dexa.com" },
        phone: { type: "string", example: "08123456789" },
        departmentId: { type: "number", example: 1 },
        position: { type: "string", example: "QA Engineer" },
        joinDate: { type: "string", example: "2026-11-07" },
        password: { type: "string", example: "password123" },
      },
    },
  })
  async create(@Body() body: any) {
    if (
      !body.employeeCode ||
      !body.name ||
      !body.email ||
      !body.departmentId ||
      !body.position ||
      !body.joinDate
    ) {
      throw new BadRequestException("Please fill in all required fields");
    }

    const result = await lastValueFrom(
      this.employeeServiceClient.send("employee.create", body),
    );
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return result;
  }

  @Patch(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Update employee details" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() body: any) {
    const result = await lastValueFrom(
      this.employeeServiceClient.send("employee.update", { id, data: body }),
    );
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return result;
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Deactivate employee (soft delete)" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    const result = await lastValueFrom(
      this.employeeServiceClient.send("employee.remove", { id }),
    );
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return result;
  }
}
